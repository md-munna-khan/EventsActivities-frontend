/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplyHostClient } from '@/components/modules/client/ApplyHostClient';
import { ShieldCheck, Zap, Globe, Users, ArrowRight } from 'lucide-react';

const ApplyHostPage = () => {
  return (
    <div className="min-h-screen bg-background pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        
    
        <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground italic">
            SHARE YOUR PASSION, <span className="text-primary not-italic">BECOME A HOST</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Join our elite community of organizers. Turn your skills into memorable experiences and earn while doing what you love.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
       
          <div className="lg:col-span-8 space-y-10">
            
         
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BenefitCard 
                icon={Zap} 
                title="Rapid Approval" 
                desc="Our automated workflow ensures your application reaches admins instantly for a 24h turnaround." 
              />
              <BenefitCard 
                icon={Users} 
                title="Expand Your Reach" 
                desc="Connect with thousands of local enthusiasts looking for unique, curated experiences." 
              />
              <BenefitCard 
                icon={Globe} 
                title="Full Autonomy" 
                desc="Set your own pricing, schedule, and capacity. Your event, your rules, our platform." 
              />
              <BenefitCard 
                icon={ShieldCheck} 
                title="Secured Payments" 
                desc="Integrated payout systems ensure you get paid promptly after every successful event." 
              />
            </section>

          
            <div className="bg-card text-card-foreground p-8 rounded-[var(--radius)] border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-8 w-1.5 bg-primary rounded-full" />
                <h3 className="text-2xl font-black uppercase tracking-tight">The Roadmap</h3>
              </div>
              
              <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-transparent">
                <Step 
                    num="01" 
                    title="Identity Verification" 
                    desc="Complete your profile and submit your host application via the dashboard." 
                />
                <Step 
                    num="02" 
                    title="Administrative Review" 
                    desc="Our team verifies your credentials to maintain community quality and safety standards." 
                />
                <Step 
                    num="03" 
                    title="Dashboard Activation" 
                    desc="Unlock host-only tools, analytics, and event creation capabilities immediately." 
                />
              </div>
            </div>
          </div>

        
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24">
               <ApplyHostClient />
               
       
               <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Joined by <span className="text-foreground">500+ hosts</span> this month
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};



const BenefitCard = ({ icon: Icon, title, desc }: any) => (
  <div className="group p-8 bg-card rounded-[var(--radius)] border border-border shadow-sm hover:border-primary/50 transition-all duration-300">
    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
      <Icon className="w-7 h-7" />
    </div>
    <h4 className="font-black text-xl mb-3 tracking-tight uppercase italic group-hover:not-italic transition-all">{title}</h4>
    <p className="text-muted-foreground text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

const Step = ({ num, title, desc }: any) => (
  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
  
    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background text-primary font-black text-xs z-10 shrink-0 shadow-[0_0_15px_rgba(var(--primary),0.2)] md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
      {num}
    </div>
   
    <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl bg-muted/30 border border-transparent hover:border-border transition-colors">
      <h5 className="font-black text-foreground uppercase tracking-tighter italic">{title}</h5>
      <p className="text-xs text-muted-foreground font-medium mt-1">{desc}</p>
    </div>
  </div>
);

export default ApplyHostPage;