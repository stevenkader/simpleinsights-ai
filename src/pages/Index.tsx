
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Brain, LineChart, Lock, PieChart, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Transform Your Business Data Into 
                  <span className="gradient-text"> Actionable Insights</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Our AI-powered analytics platform helps you understand your data, identify trends, and make better business decisions without the complexity.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link to="/signup">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/demo">Request Demo</Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                No credit card required. Free 14-day trial.
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-full w-full">
                <div className="absolute top-0 -left-4 h-72 w-72 bg-insights-blue/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 -right-4 h-72 w-72 bg-insights-navy/10 rounded-full blur-3xl" />
                <div className="relative z-10 overflow-hidden rounded-xl border bg-card p-2 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Analytics Dashboard Preview"
                    className="rounded-lg w-full object-cover"
                    width={600}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="border-y bg-muted/40 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-2xl font-bold">2,500+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">150M+</div>
              <div className="text-sm text-muted-foreground">Data Points Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">30%</div>
              <div className="text-sm text-muted-foreground">Avg. Time Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything you need to understand your data
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                SimpleInsights.ai provides powerful analytics tools that are easy to use and help you make data-driven decisions.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-card">
              <CardContent className="flex flex-col items-start p-6">
                <div className="feature-icon mb-4">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI algorithms automatically detect patterns and anomalies in your data, highlighting what's important.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="flex flex-col items-start p-6">
                <div className="feature-icon mb-4">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Interactive Dashboards</h3>
                <p className="text-muted-foreground">
                  Create custom dashboards with drag-and-drop simplicity. No technical skills required.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="flex flex-col items-start p-6">
                <div className="feature-icon mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Predictive Analytics</h3>
                <p className="text-muted-foreground">
                  Forecast future trends based on historical data to make proactive business decisions.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="flex flex-col items-start p-6">
                <div className="feature-icon mb-4">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  Bank-level encryption and compliance with major data protection regulations.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="flex flex-col items-start p-6">
                <div className="feature-icon mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Real-time Insights</h3>
                <p className="text-muted-foreground">
                  Get instant updates as your data changes, enabling quick decision-making.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-card">
              <CardContent className="flex flex-col items-start p-6">
                <div className="feature-icon mb-4">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Data Visualization</h3>
                <p className="text-muted-foreground">
                  Transform complex data into clear, compelling visualizations that tell a story.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Testimonials</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Trusted by businesses worldwide
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See what our customers are saying about how SimpleInsights.ai has transformed their business analytics.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    alt="Testimonial author"
                    className="rounded-full border object-cover"
                    height="64"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                    style={{
                      aspectRatio: "64/64",
                      objectFit: "cover",
                    }}
                    width="64"
                  />
                  <div className="grid gap-1">
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">CMO, TechStart Inc.</p>
                  </div>
                </div>
                <blockquote className="mt-4 border-l-2 pl-4 italic">
                  "SimpleInsights.ai has revolutionized how we approach marketing analytics. We've increased our ROI by 40% since implementing the platform."
                </blockquote>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    alt="Testimonial author"
                    className="rounded-full border object-cover"
                    height="64"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                    style={{
                      aspectRatio: "64/64",
                      objectFit: "cover",
                    }}
                    width="64"
                  />
                  <div className="grid gap-1">
                    <h4 className="font-semibold">David Chen</h4>
                    <p className="text-sm text-muted-foreground">Head of Operations, GlobalRetail</p>
                  </div>
                </div>
                <blockquote className="mt-4 border-l-2 pl-4 italic">
                  "The predictive analytics feature has been a game-changer for our inventory management. We've reduced wastage by 25% in just three months."
                </blockquote>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    alt="Testimonial author"
                    className="rounded-full border object-cover"
                    height="64"
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                    style={{
                      aspectRatio: "64/64",
                      objectFit: "cover",
                    }}
                    width="64"
                  />
                  <div className="grid gap-1">
                    <h4 className="font-semibold">Amara Patel</h4>
                    <p className="text-sm text-muted-foreground">CEO, FinSolve Partners</p>
                  </div>
                </div>
                <blockquote className="mt-4 border-l-2 pl-4 italic">
                  "As a financial services provider, data security is paramount. SimpleInsights.ai provides the robust protection we need while delivering powerful analytics."
                </blockquote>
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
                Ready to transform your data into insights?
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4">
              <p className="text-lg/relaxed lg:text-xl/relaxed">
                Join thousands of businesses that use SimpleInsights.ai to make better decisions, faster. Start your free trial today.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/signup">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white hover:bg-white/10" asChild>
                  <Link to="/demo">Schedule a Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="section-padding">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Blog</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Latest insights
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover tips, strategies, and industry trends to maximize your data's potential.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden hover-card">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Data Visualization Trends"
                className="aspect-[16/9] w-full object-cover"
              />
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">June 12, 2023</div>
                <h3 className="text-xl font-bold mt-2">5 Data Visualization Trends to Watch in 2023</h3>
                <p className="text-muted-foreground mt-2">
                  Learn about the latest trends in data visualization and how they can enhance your business analytics.
                </p>
                <Button variant="link" className="px-0 mt-4" asChild>
                  <Link to="/blog/data-visualization-trends">Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover-card">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="AI in Business Analytics"
                className="aspect-[16/9] w-full object-cover"
              />
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">May 28, 2023</div>
                <h3 className="text-xl font-bold mt-2">How AI is Revolutionizing Business Analytics</h3>
                <p className="text-muted-foreground mt-2">
                  Discover how artificial intelligence is transforming data analysis and decision-making processes.
                </p>
                <Button variant="link" className="px-0 mt-4" asChild>
                  <Link to="/blog/ai-business-analytics">Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="overflow-hidden hover-card">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Data Privacy Compliance"
                className="aspect-[16/9] w-full object-cover"
              />
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">April 15, 2023</div>
                <h3 className="text-xl font-bold mt-2">Data Privacy Compliance: What You Need to Know</h3>
                <p className="text-muted-foreground mt-2">
                  Stay compliant with evolving data privacy regulations while still leveraging your data effectively.
                </p>
                <Button variant="link" className="px-0 mt-4" asChild>
                  <Link to="/blog/data-privacy-compliance">Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-10 flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/blog">View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
