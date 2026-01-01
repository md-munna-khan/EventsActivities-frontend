import Link from 'next/link';

function PublicFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-2">Evenzo Doc</h3>
            <p className="text-sm text-muted-foreground">Your Events is our priority. We are here to provide the best event services.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Home</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Services</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <p className="text-sm text-muted-foreground">
             Mirpur 2 <br />
              Dhaka<br />
              contact:01867418698
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}Evenzo Doc. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
export default PublicFooter;