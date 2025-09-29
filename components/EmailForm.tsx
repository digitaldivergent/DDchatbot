import React, { useState } from 'react';

interface EmailFormProps {
  onSubmit: (contactInfo: { email: string; phone: string }) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      // Simple email validation
      return;
    }
    setIsLoading(true);
    // Simulate a quick network delay
    setTimeout(() => {
        onSubmit({ email, phone });
        setIsLoading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 rounded-lg bg-slate-700/50 border border-fuchsia-500/50">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email for the free proposal..."
          className="flex-1 w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-50"
          required
          disabled={isLoading}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number (Optional)"
          className="flex-1 w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-fuchsia-600 text-white font-bold rounded-md py-2 px-6 hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-wait"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Get My Proposal'}
        </button>
      </div>
    </form>
  );
};

export default EmailForm;