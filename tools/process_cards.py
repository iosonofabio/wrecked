#!/bin/usr/python
# vim: fdm=indent
'''
author:     Fabio Zanini
date:       18/01/23
content:    Process DOCX with cards text into separate documents.
'''
import os
import shutil
import pathlib
import docx


def make_header(cardname):
    '''Make a front matter for each card'''
    lines = f'''\
---
layout: page
title: "{cardname}"
categories: cards
---\n
'''
    return lines


if __name__ == '__main__':

    fdn_root = pathlib.Path(__file__).parent / '..'
    fn_cards = fdn_root / 'card_text.docx'

    document = docx.Document(fn_cards)

    cards = {}
    card_name = None
    card_text = []
    for par in document.paragraphs:
        partext = par.text.strip('\n')
        if partext.isdigit():
            if len(card_text) != 0:
                card_text = '\n\n'.join(card_text)
                cards[card_name] = card_text
                card_text = []
            card_name = partext
        elif card_name is not None:
            if partext.startswith('R: '):
                partext = '**R:**' + partext[2:]
            card_text.append(partext)

    fdn_src = fdn_root / 'cards'

    shutil.rmtree(fdn_src)
    os.mkdir(fdn_src)

    for name, text in cards.items():
        with open(fdn_src / f'{name}.md', 'wt') as f:
            f.write(make_header(name))
            f.write(text)

            # Inject JS if necessary
            if os.path.isfile(fdn_root / 'assets' / 'card_scripts' / f'{name}.js'):
                f.write('\n\n')
                f.write('<script type="module" src="/assets/js.cookie.min.mjs"></script>\n')
                f.write(f'<script type="module" src="/assets/card_scripts/{name}.js"></script>\n')
