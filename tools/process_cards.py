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


def package_cards_js(cards, fn_js):
    '''Store cards in a JavaScript object for frontend manipulation'''
    with open(fn_js, 'wt') as fout:
        indent = 0
        fout.write('wreckedStorage = {\n')
        indent += 2

        # Card text
        fout.write(' ' * indent + '"text": {\n')
        indent += 2
        for cardname, card_text in cards.items():
            paragraphs = []
            for par in card_text.split('\n'):
                if par == '':
                    continue
                if '<script>' in par:
                    continue
                # Escape - there must be a better way ;-)
                par = par.replace('"', '\\"')
                paragraphs.append(par)
            fout.write(
                    ' ' * indent + f'"{cardname}": ['
            )
            fout.write(','.join([f'"{p}"' for p in paragraphs]))
            fout.write('],\n')

        indent -= 2
        fout.write(' ' * indent + '},\n')

        # Tokens
        tokens = ['start', 'gyroscope', 'thermallance', 'fin', 'heliox']
        fout.write(' ' * indent + "tokens: {\n")
        indent += 2
        for token in tokens:
            fout.write(' ' * indent + f'{token}: false,\n')
        indent -= 2
        fout.write(' ' * indent + '},\n')

        # Current card
        fout.write(' ' * indent + "currentCard: 'none',\n")

        indent -= 2
        fout.write(' ' * indent + '}\n')


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
            #if partext.startswith('R: '):
            #    partext = '---\n**R:**' + partext[2:]+'\n\n---'
            card_text.append(partext)

    fdn_src = fdn_root / 'cards'

    package_cards_js(cards, fdn_root / 'assets' / 'wreckedStorage.js')
