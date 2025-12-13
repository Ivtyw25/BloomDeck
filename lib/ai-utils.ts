export function cleanJsonString(text: string): string {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) return text;

    let clean = text.substring(firstBrace, lastBrace + 1);

    // Remove BOM and other invisible characters
    clean = clean.replace(/[\uFEFF\u200B\u200C\u200D\u200E\u200F\u2028\u2029]/g, '');

    // Replace smart quotes
    clean = clean.replace(/[\u201C\u201D]/g, '"');
    clean = clean.replace(/[\u2018\u2019]/g, "'");

    // Remove comments
    clean = clean.replace(/\/\/.*$/gm, ''); // single line
    clean = clean.replace(/\/\*[\s\S]*?\*\//g, ''); // multi line

    // Fix single quotes around keys
    clean = clean.replace(/([{,]\s*)'([a-zA-Z0-9_]+?)'\s*:/g, '$1"$2":');
    // Fix unquoted keys
    clean = clean.replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":');
    // Fix trailing commas before closing braces/brackets
    clean = clean.replace(/,(\s*[}\]])/g, '$1');

    return clean;
}
