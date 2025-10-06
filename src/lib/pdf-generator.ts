
'use client';

import jsPDF from 'jspdf';
import type { ScanResult } from '@/ai/flows/scanner-flow';

export const generatePdf = (scannedUrl: string, scanResults: ScanResult) => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - margin * 2;
    let y = 20;

    // --- Header ---
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CyberWall Security Report', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setDrawColor(200); // divider color
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;


    // --- Scan Details ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`URL Scanned: ${scannedUrl}`, margin, y);
    y += 7;
    doc.text(`Scan Date: ${new Date().toLocaleString()}`, margin, y);
    y += 12;

    
    // --- Summary ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Scan Summary', margin, y);
    y += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(scanResults.summary, usableWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Overall Security Score: ${scanResults.overallScore}/100`, margin, y);
    y += 15;

    // --- Vulnerabilities ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Vulnerabilities Found', margin, y);
    y += 10;

    const checkAndAddPage = (heightNeeded: number) => {
        if (y + heightNeeded > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
        }
    };

    if (scanResults.vulnerabilities.length > 0) {
        scanResults.vulnerabilities.forEach((vuln, index) => {
            checkAndAddPage(40); // Estimate height for a new vulnerability entry

            // Severity Badge
            let severityColor = '#6b7280'; // gray-500
            if (vuln.severity === 'Critical') severityColor = '#ef4444'; // red-500
            if (vuln.severity === 'High') severityColor = '#f97316'; // orange-500
            if (vuln.severity === 'Medium') severityColor = '#eab308'; // yellow-500
            if (vuln.severity === 'Low') severityColor = '#3b82f6'; // blue-500
            
            doc.setFillColor(severityColor);
            doc.roundedRect(margin, y - 4, 25, 6, 2, 2, 'F');
            doc.setFontSize(10);
            doc.setTextColor('#ffffff');
            doc.setFont('helvetica', 'bold');
            doc.text(vuln.severity, margin + 12.5, y, { align: 'center' });

            // Title
            doc.setFontSize(14);
            doc.setTextColor('#000000');
            doc.setFont('helvetica', 'bold');
            doc.text(vuln.title, margin + 30, y);
            y += 12;

            // Description
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Description', margin, y);
            y += 6;
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            const descLines = doc.splitTextToSize(vuln.description, usableWidth);
            checkAndAddPage(descLines.length * 5);
            doc.text(descLines, margin, y);
            y += descLines.length * 5 + 8;

             // Remediation
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('AI-Powered Remediation', margin, y);
            y += 6;
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            const remLines = doc.splitTextToSize(vuln.remediation, usableWidth);
            checkAndAddPage(remLines.length * 5);
            doc.text(remLines, margin, y);
            y += remLines.length * 5 + 10;

            if(index < scanResults.vulnerabilities.length - 1) {
                doc.setDrawColor(220);
                doc.line(margin, y, pageWidth - margin, y);
                y+= 10;
            }
        });
    } else {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('No vulnerabilities were found during this scan.', margin, y);
    }

    doc.save(`CyberWall-Report-${new URL(scannedUrl).hostname}.pdf`);
};

    