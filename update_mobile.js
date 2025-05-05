const fs = require('fs');
const path = require('path');

// Function to recursively get all HTML files
function getHtmlFiles(directory) {
    let htmlFiles = [];
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
        const fullPath = path.join(directory, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
            htmlFiles = [...htmlFiles, ...getHtmlFiles(fullPath)];
        } else if (path.extname(fullPath) === '.html') {
            htmlFiles.push(fullPath);
        }
    }
    
    return htmlFiles;
}

// Function to update HTML files
function updateHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has hamburger menu
    if (content.includes('hamburger-menu')) {
        console.log(`${filePath} already has hamburger menu.`);
        return;
    }
    
    // Find the header structure
    const headerRegex = /<header>[\s\S]*?<div class="container">([\s\S]*?)<\/div>[\s\S]*?<\/header>/;
    const headerMatch = content.match(headerRegex);
    
    if (!headerMatch) {
        console.log(`Could not find header in ${filePath}`);
        return;
    }
    
    // Extract the inner content of the header
    const headerContent = headerMatch[1];
    
    // Check if the header has a logo and nav
    const hasLogo = headerContent.includes('<div class="logo">');
    const hasNav = headerContent.includes('<nav>');
    
    if (!hasLogo || !hasNav) {
        console.log(`Header in ${filePath} doesn't have the expected structure`);
        return;
    }
    
    // Update the header with hamburger menu
    let updatedHeaderContent;
    
    if (headerContent.includes('<nav>')) {
        // If nav tag exists, add hamburger menu before it
        updatedHeaderContent = headerContent.replace(
            /(<div class="logo">[\s\S]*?<\/div>)([\s\S]*?)<nav>/,
            '$1\n            <div class="hamburger-menu">\n                <span></span>\n                <span></span>\n                <span></span>\n            </div>\n            <nav>'
        );
    } else {
        console.log(`Could not find nav in ${filePath}`);
        return;
    }
    
    // Replace the header content with the updated one
    content = content.replace(headerContent, updatedHeaderContent);
    
    // Add JavaScript reference before closing body tag
    const isSpeciesPage = filePath.includes('species/');
    const scriptPath = isSpeciesPage ? '../js/main.js' : 'js/main.js';
    
    if (!content.includes(scriptPath)) {
        content = content.replace(
            /<\/body>/,
            `    <script src="${scriptPath}"></script>\n</body>`
        );
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

// Update a specific file manually
function updateSpecificFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Species file structure
        if (filePath.includes('species/')) {
            // For files in the species directory
            if (content.includes('<nav>')) {
                content = content.replace(
                    /<div class="container">[\s\S]*?<div class="logo">([\s\S]*?)<\/div>[\s\S]*?<nav>/,
                    '<div class="container">\n            <div class="logo">$1</div>\n            <div class="hamburger-menu">\n                <span></span>\n                <span></span>\n                <span></span>\n            </div>\n            <nav>'
                );
            }
            
            // Add script tag
            if (!content.includes('../js/main.js')) {
                content = content.replace(
                    /<\/body>/,
                    '    <script src="../js/main.js"></script>\n</body>'
                );
            }
        } else {
            // For files in the root directory
            if (content.includes('<nav>')) {
                content = content.replace(
                    /<div class="container">[\s\S]*?<div class="logo">([\s\S]*?)<\/div>[\s\S]*?<nav>/,
                    '<div class="container">\n            <div class="logo">$1</div>\n            <div class="hamburger-menu">\n                <span></span>\n                <span></span>\n                <span></span>\n            </div>\n            <nav>'
                );
            }
            
            // Add script tag
            if (!content.includes('js/main.js')) {
                content = content.replace(
                    /<\/body>/,
                    '    <script src="js/main.js"></script>\n</body>'
                );
            }
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully updated ${filePath}`);
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error);
    }
}

// Get all HTML files in the current directory and subdirectories
const htmlFiles = getHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML files.`);

// Update each HTML file
htmlFiles.forEach(file => {
    try {
        updateSpecificFile(file);
    } catch (error) {
        console.error(`Error processing file ${file}:`, error);
    }
});

console.log('Update completed.'); 