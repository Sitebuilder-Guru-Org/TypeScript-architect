const icons: IconConfig[] = [];

export interface IconConfig {
    icon: string;
    name: string;
}

export function getFontAwesomeIconList() {
    if (icons.length) {
        return icons;
    }

    const sheet = findSheet();
    for (const key in sheet.cssRules) {
        const rule = sheet.cssRules[key];
        if (
            rule instanceof CSSStyleRule &&
            'selectorText' in rule &&
            rule.selectorText.endsWith('::before')
        ) {
            const name = rule.selectorText
                .replace('::before', '')
                .replace('fa-', '')
                .replace('.', '');
            icons.push({
                icon: `fa fa-${name}`,
                name,
            });
        }
    }

    return icons;
}

function findSheet(): CSSStyleSheet {
    for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        if (sheet.href && sheet.href.includes('font-awesome')) {
            return sheet;
        }
    }
}
