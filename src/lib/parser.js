import * as pdfjsLib from 'pdfjs-dist';

// Use CDN for the worker to avoid complex Vite configuration for workers
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function parseFileToText(file) {
    if (!file) throw new Error("No file provided");

    const extension = file.name.split('.').pop().toLowerCase();

    if (extension === 'txt') {
        return await file.text();
    } 
    
    if (extension === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    }

    throw new Error(`Unsupported file type: ${extension}. Please upload a .txt or .pdf file.`);
}
