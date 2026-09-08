import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as sass from 'sass';

const ACCORDION = readFileSync(resolve(__dirname, '../../src/components/MaxAccordion.vue'), 'utf-8');
const ACCORDION_ITEM = readFileSync(resolve(__dirname, '../../src/components/MaxAccordionItem.vue'), 'utf-8');
const DRAWER = readFileSync(resolve(__dirname, '../../src/components/MaxDrawer.vue'), 'utf-8');
const MENU_VERTICAL_ITEM = readFileSync(resolve(__dirname, '../../src/components/MaxMenuVerticalItem.vue'), 'utf-8');
const TABLE_FIELDS = readFileSync(resolve(__dirname, '../../src/components/MaxTableFields.vue'), 'utf-8');
const FILE_UPLOAD_BUTTON = readFileSync(resolve(__dirname, '../../src/components/MaxInputFileUploadButton.vue'), 'utf-8');
const BASE_INPUT = readFileSync(resolve(__dirname, '../../src/components/base/MaxBaseInput.vue'), 'utf-8');
const COLORS_RAW = readFileSync(resolve(__dirname, '../../src/themes/colors.scss'), 'utf-8');

describe('Padronização de cores de texto para var(--background-600) e remoção da rampa --text', () => {
    describe('src/themes/colors.scss', () => {
        it('não deve conter a rampa redundante --text nem --text-0..900', () => {
            // Nem no light nem no dark
            expect(COLORS_RAW).not.toMatch(/^\s*--text\s*:\s*#[0-9a-fA-F]+/m);
            expect(COLORS_RAW).not.toMatch(/--text-\d+:/);
        });

        it('deve preservar os aliases semânticos mapeados para --background-*', () => {
            expect(COLORS_RAW).toMatch(/--text-b:\s*var\(--background-800\);/);
            expect(COLORS_RAW).toMatch(/--text-c:\s*var\(--background-750\);/);
            expect(COLORS_RAW).toMatch(/--text-d:\s*var\(--background-700\);/);
            expect(COLORS_RAW).toMatch(/--text-color:\s*var\(--background-800\);/);
        });

        it('compila sem erros com sass', () => {
            const compiled = sass.compile(resolve(__dirname, '../../src/themes/colors.scss')).css;
            expect(compiled).toBeTruthy();
        });
    });

    describe('MaxAccordion e MaxAccordionItem', () => {
        it('MaxAccordion deve definir color: var(--background-600)', () => {
            const style = ACCORDION.split('<style')[1] ?? '';
            expect(style).toMatch(/color:\s*var\(--background-600\)/);
        });

        it('MaxAccordionItem deve definir color: var(--background-600) no header e não color: inherit', () => {
            const style = ACCORDION_ITEM.split('<style')[1] ?? '';
            expect(style).not.toMatch(/color:\s*inherit;/);
            expect(style).toMatch(/color:\s*var\(--background-600\)/);
        });
    });

    describe('MaxDrawer', () => {
        it('MaxDrawer deve definir color: var(--background-600) no container e no botão close', () => {
            const style = DRAWER.split('<style')[1] ?? '';
            expect(style).toMatch(/color:\s*var\(--background-600\)/);
            expect(style).not.toMatch(/\.max-drawer-close\s*\{[^}]*color:\s*inherit;/);
        });
    });

    describe('MaxMenuVerticalItem', () => {
        it('não deve usar var(--text-250) e deve usar var(--background-600)', () => {
            const style = MENU_VERTICAL_ITEM.split('<style')[1] ?? '';
            expect(style).not.toMatch(/var\(--text-250\)/);
            expect(style).toMatch(/color:\s*var\(--background-600\)/);
        });
    });

    describe('MaxTableFields', () => {
        it('não deve usar var(--text-400) e deve usar var(--background-600) no estado vazio', () => {
            const style = TABLE_FIELDS.split('<style')[1] ?? '';
            expect(style).not.toMatch(/var\(--text-400\)/);
            expect(style).toMatch(/color:\s*var\(--background-600\)/);
        });
    });

    describe('MaxInputFileUploadButton', () => {
        it('não deve usar var(--background-0) como cor de texto no label e deve usar var(--background-600)', () => {
            const style = FILE_UPLOAD_BUTTON.split('<style')[1] ?? '';
            expect(style).not.toMatch(/\.input-file-button-label\s*\{[^}]*color:\s*var\(--background-0\)/);
            expect(style).toMatch(/\.input-file-button-label\s*\{[^}]*color:\s*var\(--background-600\)/);
        });
    });

    describe('MaxBaseInput', () => {
        it('não deve usar var(--text-color-secondary) inexistente no placeholder e deve usar var(--background-600)', () => {
            const style = BASE_INPUT.split('<style')[1] ?? '';
            expect(style).not.toMatch(/var\(--text-color-secondary\)/);
            expect(style).toMatch(/color:\s*var\(--background-600\)/);
        });
    });
});
