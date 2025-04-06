
import React from 'react';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>FAQ - SimpleInsights.ai</title>
        <meta name="description" content="Frequently asked questions about SimpleInsights.ai" />
      </Helmet>
      
      <Navigation />
      
      <main className="container py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Find answers to the most common questions about SimpleInsights.ai
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                What is SimpleInsights.ai?
              </AccordionTrigger>
              <AccordionContent>
                SimpleInsights.ai is a platform that transforms complex documents into easily understandable insights. 
                Our AI-powered tools help you analyze legal documents, medical reports, and translate content between languages.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                How does the Legal Assistant feature work?
              </AccordionTrigger>
              <AccordionContent>
                Our Legal Assistant uses advanced AI to analyze legal documents, contracts, and agreements. 
                Simply upload your document, and our system will extract key information, identify potential issues, 
                and provide a plain-language summary of the most important aspects.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Is my data secure when using SimpleInsights.ai?
              </AccordionTrigger>
              <AccordionContent>
                Yes, we take data security very seriously. All document uploads are encrypted, and we don't store 
                your documents longer than necessary for processing. Our system is designed with privacy in mind, 
                and we adhere to strict data protection standards. For more details, please review our Privacy Policy.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Can I use SimpleInsights.ai for professional work?
              </AccordionTrigger>
              <AccordionContent>
                Yes, SimpleInsights.ai is designed for both personal and professional use. However, we recommend that 
                professionals use our insights as a supplementary tool rather than a replacement for expert judgment. 
                Our AI provides valuable analysis, but critical decisions should always involve human expertise.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                How accurate is the Translation Assistant?
              </AccordionTrigger>
              <AccordionContent>
                Our Translation Assistant provides high-quality translations across multiple languages. While it achieves 
                a high degree of accuracy, translation involves nuance that AI systems continue to improve upon. For critical 
                documents, we recommend having a human translator review the output, especially for legal or technical content.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                What file formats are supported?
              </AccordionTrigger>
              <AccordionContent>
                Currently, we support PDF documents, Word files (.docx), and plain text (.txt) files. We're working to expand 
                support for additional file formats in the future. For best results, we recommend using PDF files with searchable text.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left">
                Is there a limit on document size or length?
              </AccordionTrigger>
              <AccordionContent>
                Yes, there are some limitations. Free accounts can process documents up to 10 pages or 5MB in size. 
                Premium subscriptions allow for larger documents up to 50 pages or 25MB. For exceptionally large documents, 
                please contact our support team for custom solutions.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left">
                How can I get help if I have a problem?
              </AccordionTrigger>
              <AccordionContent>
                For any issues or questions, you can reach our support team through the Contact page. We typically respond 
                within 24 hours on business days. Premium users have access to expedited support through our dedicated 
                support channel.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default FAQ;
