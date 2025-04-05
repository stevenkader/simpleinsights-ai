
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, FileType, Globe, Lock, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      {/* Hero Section - Simplified */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col justify-center space-y-4 mx-auto text-center max-w-3xl">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Understand Complex Documents with 
                <span className="gradient-text"> AI Simplicity</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section - Moved up and with background color */}
      <section className="section-padding bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Our Tools</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Three powerful ways to understand documents
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                SimpleInsights.ai provides three specialized tools designed to make complex documents approachable for everyone.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-3">
            <Card className="hover-card">
              <CardContent className="flex flex-col items-start p-6">
                <div className="feature-icon mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Legal Assistant</h3>
                <p className="text-muted-foreground mt-2">
                  Upload PDF of legal contract to get detailed laymen explanation.
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/legal-assistant">Try It Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="flex flex-col items-start p-6">
                <div className="feature-icon mb-4">
                  <FileType className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Medical Assistant</h3>
                <p className="text-muted-foreground mt-2">
                  Upload PDF of test results to understand them.
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/medical-reports">Try It Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="flex flex-col items-start p-6">
                <div className="feature-icon mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Expert Translator</h3>
                <p className="text-muted-foreground mt-2">
                  Upload PDF in any language and get it translated to English.
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/translation-assistant">Try It Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">How It Works</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple process, powerful results
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI-powered platform makes understanding complex documents easier than ever.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-4">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Choose Your Tool</h3>
                <p className="text-muted-foreground mt-2">
                  Select whether you want a legal explanation, medical interpretation, or translation.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Upload Your Document</h3>
                <p className="text-muted-foreground mt-2">
                  Simply upload the PDF, Word document, or text file you need help understanding.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Get Clear Insights</h3>
                <p className="text-muted-foreground mt-2">
                  Receive easy-to-understand explanations, interpretations, and translations tailored to your needs.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold">Save & Share</h3>
                <p className="text-muted-foreground mt-2">
                  Save your insights for future reference or easily share them with others who need to understand the document.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-padding">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Use Cases</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Who can benefit?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                SimpleInsights.ai helps people from all walks of life understand complex information.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Students</h3>
                <p className="text-muted-foreground mt-2">
                  Break down complex academic papers, textbooks, and study materials into understandable concepts.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Researchers</h3>
                <p className="text-muted-foreground mt-2">
                  Quickly understand key findings from research papers outside your immediate field of expertise.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">General Public</h3>
                <p className="text-muted-foreground mt-2">
                  Make sense of legal documents, terms of service, insurance policies, and more without the jargon.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Professionals</h3>
                <p className="text-muted-foreground mt-2">
                  Quickly grasp the essentials of industry reports, technical documentation, and specialized content.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Non-Native Speakers</h3>
                <p className="text-muted-foreground mt-2">
                  Get help understanding complex documents in languages you're still mastering.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Busy Individuals</h3>
                <p className="text-muted-foreground mt-2">
                  Save time by quickly extracting key information from lengthy documents when you're short on time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to understand complex documents better?
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4">
              <p className="text-lg/relaxed lg:text-xl/relaxed">
                Join thousands of people who use SimpleInsights.ai to make sense of complex information. Start today.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/legal-assistant">Try It Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white hover:bg-white/10" asChild>
                  <Link to="/legal-assistant">See How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Promise Section */}
      <section className="section-padding">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Privacy</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Your documents stay private
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We're committed to protecting your information and the privacy of your documents.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-3">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-center">Secure Processing</h3>
                <p className="text-muted-foreground mt-2 text-center">
                  Your documents are processed in a secure environment and never stored longer than necessary.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-center">No Data Selling</h3>
                <p className="text-muted-foreground mt-2 text-center">
                  We will never sell your data or documents to third parties. Your information stays yours.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-center">User Control</h3>
                <p className="text-muted-foreground mt-2 text-center">
                  You can delete your documents and any generated insights at any time.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-10 flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/privacy">Learn More About Our Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
