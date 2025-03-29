
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Send, Loader2 } from "lucide-react";

interface FormValues {
  legalQuery: string;
}

const LegalAssistant = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormValues>({
    defaultValues: {
      legalQuery: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResponse("");
    
    try {
      // This is a placeholder for the actual API call
      // We'll replace this with the real backend call once you provide the API details
      setTimeout(() => {
        setResponse("This is a simulated response from the legal assistant. This will be replaced with actual API responses once integrated with your backend.");
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error querying legal assistant:", error);
      setResponse("Sorry, there was an error processing your request. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Legal Assistant</h1>
            <p className="text-lg text-muted-foreground">
              Get instant answers to your legal questions powered by AI
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="legalQuery"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your legal situation or ask a legal question..."
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="flex items-center gap-2"
                      disabled={isLoading || !form.watch("legalQuery")}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {response && (
            <Card className="bg-slate-50 dark:bg-slate-900">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">Response:</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{response}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">How to use the Legal Assistant</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover-card">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">1. Ask a Question</h3>
                  <p className="text-sm text-muted-foreground">
                    Type your legal question or describe your situation in detail.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-card">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">2. Get Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your query and provides relevant legal information.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-card">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">3. Take Action</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the insights to better understand your situation and next steps.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Disclaimer:</strong> This AI assistant provides general legal information, not legal advice. 
              Always consult with a qualified attorney for advice specific to your situation.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalAssistant;
