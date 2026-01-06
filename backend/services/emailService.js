/**
 * Email Notification Service
 * Sends analysis results via email using Nodemailer
 */

const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
    constructor() {
        // Create transporter for Gmail
        this.transporter = nodemailer.createTransport({
            service: config.EMAIL_SERVICE,
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASSWORD
            }
        });
    }

    /**
     * Send document analysis via email
     * @param {string} recipientEmail - Recipient's email address
     * @param {string} documentName - Name of analyzed document
     * @param {Object} analysis - Analysis results
     * @returns {Promise<Object>} Send result
     */
    async sendAnalysis(recipientEmail, documentName, analysis) {
        try {
            const emailContent = this.formatAnalysisEmail(documentName, analysis);

            const mailOptions = {
                from: `DocuMind AI <${config.EMAIL_USER}>`,
                to: recipientEmail,
                subject: `📄 Document Analysis Complete: ${documentName}`,
                html: emailContent
            };

            const info = await this.transporter.sendMail(mailOptions);

            return {
                success: true,
                messageId: info.messageId,
                message: 'Email sent successfully'
            };
        } catch (error) {
            console.error('Email sending error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Format analysis data into HTML email
     * @param {string} documentName - Document name
     * @param {Object} analysis - Analysis object
     * @returns {string} HTML email content
     */
    formatAnalysisEmail(documentName, analysis) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { margin-bottom: 25px; background: white; padding: 20px; border-radius: 8px; 
                     box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .section-title { color: #667eea; font-size: 18px; font-weight: bold; 
                          margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
          .key-points { list-style: none; padding: 0; }
          .key-points li { padding: 10px; margin: 5px 0; background: #f0f4ff; 
                          border-left: 4px solid #667eea; border-radius: 4px; }
          .badge { display: inline-block; padding: 5px 12px; border-radius: 20px; 
                   font-size: 12px; font-weight: bold; margin: 5px; }
          .badge-positive { background: #d4edda; color: #155724; }
          .badge-neutral { background: #fff3cd; color: #856404; }
          .badge-negative { background: #f8d7da; color: #721c24; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-box { text-align: center; padding: 15px; background: white; border-radius: 8px; flex: 1; margin: 0 5px; }
          .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
          .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🤖 DocuMind AI</h1>
            <p>Document Analysis Complete</p>
          </div>
          
          <div class="content">
            <h2 style="color: #333;">📄 ${documentName}</h2>
            
            <div class="stats">
              <div class="stat-box">
                <div class="stat-number">${analysis.wordCount || 'N/A'}</div>
                <div class="stat-label">Words</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${analysis.readingTime || 'N/A'}</div>
                <div class="stat-label">Reading Time</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${analysis.keyPoints?.length || 0}</div>
                <div class="stat-label">Key Points</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">📋 Executive Summary</div>
              <p>${analysis.summary || 'No summary available'}</p>
            </div>

            <div class="section">
              <div class="section-title">🔑 Key Points</div>
              <ul class="key-points">
                ${(analysis.keyPoints || []).map(point => `<li>${point}</li>`).join('')}
              </ul>
            </div>

            ${analysis.actionItems && analysis.actionItems.length > 0 ? `
            <div class="section">
              <div class="section-title">✅ Action Items</div>
              <ul class="key-points">
                ${analysis.actionItems.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            <div class="section">
              <div class="section-title">😊 Sentiment Analysis</div>
              <span class="badge badge-${analysis.sentiment?.toLowerCase() || 'neutral'}">
                ${analysis.sentiment || 'Neutral'}
              </span>
            </div>

            ${analysis.topics && analysis.topics.length > 0 ? `
            <div class="section">
              <div class="section-title">🏷️ Topics</div>
              ${analysis.topics.map(topic => `<span class="badge" style="background: #e3f2fd; color: #1976d2;">${topic}</span>`).join('')}
            </div>
            ` : ''}

            ${analysis.entities && Object.keys(analysis.entities).length > 0 ? `
            <div class="section">
              <div class="section-title">🎯 Key Entities</div>
              ${Object.entries(analysis.entities).map(([type, items]) =>
            items && items.length > 0 ? `
                  <p><strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${items.join(', ')}</p>
                ` : ''
        ).join('')}
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>🤖 Powered by DocuMind AI with Groq Llama 3.3</p>
            <p>This analysis was automatically generated. For questions, visit your DocuMind dashboard.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }

    /**
     * Verify email configuration
     * @returns {Promise<boolean>} Verification result
     */
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✓ Email service ready');
            return true;
        } catch (error) {
            console.error('✗ Email service error:', error.message);
            return false;
        }
    }
}

module.exports = new EmailService();