# vim: fdm=indent
'''
author:     Fabio Zanini
date:       18/01/23
content:    Process DOCX with cards text into separate documents.
'''
import os
import pathlib
import docx


def make_header(cardname):
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
    key = None
    for par in document.paragraphs:
        partext = par.text.strip('\n')
        if partext.isdigit():
            key = partext
        elif key is not None:
            cards[key] = partext
            key = None

    fdn_src = fdn_root / 'cards'
    if not os.path.isdir(fdn_src):
        os.mkdir(fdn_src)
    for name, text in cards.items():
        with open(fdn_src / f'{name}.md', 'wt') as f:
            f.write(make_header(name))
            f.write(text)

            # TODO: Do we need to inject javascript here?
