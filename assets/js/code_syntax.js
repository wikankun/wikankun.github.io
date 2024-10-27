const copyIconSVG = `
<svg class="copy-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
</svg>`;

const checkIconSVG = `
<svg class="check-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
</svg>`;

function createCopyButton() {
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.innerHTML = copyIconSVG;
  button.setAttribute('title', 'Copy to clipboard');
  return button;
}

function createFeedback() {
  const feedback = document.createElement('span');
  feedback.className = 'copy-feedback';
  feedback.textContent = 'Copied!';
  return feedback;
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

document.querySelectorAll('.highlight pre.highlight code').forEach(codeElement => {
    const lines = codeElement.textContent.split('\n');
    const trimmedLines = lines.map(line => line.trim());
    codeElement.textContent = trimmedLines.join('\n');

    const container = document.createElement('div');
    container.className = 'code-container';
    codeElement.parentNode.insertBefore(container, codeElement);
    container.appendChild(codeElement);

    const button = createCopyButton();
    container.appendChild(button);

    button.addEventListener('click', async () => {
        const success = await copyToClipboard(codeElement.textContent);
        
        if (success) {
            button.innerHTML = checkIconSVG;
            const feedback = createFeedback();
            button.appendChild(feedback);

            setTimeout(() => {
                button.innerHTML = copyIconSVG;
                feedback.remove();
            }, 2000);
        }
    });
});
