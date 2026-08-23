import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Loader2, AlertTriangle, FileText } from 'lucide-react';
import { API_URL } from '../config';

const SubmitFeedback = () => {
    const [text, setText] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!text.trim()) {
            setMessage({ type: 'error', text: 'Feedback cannot be empty.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            const response = await fetch(`${API_URL}/feedbacks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            
            if (response.ok) {
                setMessage({ type: 'success', text: 'Feedback submitted anonymously. Thank you!' });
                setText('');
            } else {
                const errorData = await response.json().catch(() => ({}));
                setMessage({ type: 'error', text: errorData.message || 'Failed to submit feedback.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Server connection failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-deep-black flex items-center justify-center p-6 relative pt-32 pb-24">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-blue/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl glass-panel p-8 md:p-12 rounded-xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>
                
                <div className="text-center mb-8">
                    <img
    src="/TRS_LOGO.png"
    alt="TRS"
    className="w-20 h-20 mx-auto mb-5 object-contain hover:scale-105 hover:-translate-y-2 hover:-rotate-6 transition-all duration-500"
/>
                    <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tight mb-2 text-white drop-shadow-lg">TRS <span className="
text-transparent
bg-clip-text

bg-gradient-to-l
from-neon-purple
via-white
to-electric-blue

bg-[length:400%_auto]

animate-gradient-x

hover:drop-shadow-[0_0_25px_rgba(176,38,255,0.5)]

transition-all
duration-50
">   COMMUNICATIONS
</span></h2>
                    <p className="text-white/50 text-sm tracking-widest hover:text-white transition-all duration-500 uppercase">Suggestions, incident reports, event feedback, complaints, and community recommendations..</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 group">

    <div className="glass-panel p-3 text-center group-hover:border-electric-blue/50 transition-all duration-500">
        <div className="text-electric-blue font-black group-hover:text-white transition-all duration-500">
            REPORT
        </div>
        <div className="text-[10px] uppercase text-white/40 group-hover:text-electric-blue transition-all duration-500">
            Violations
        </div>
    </div>

    <div className="glass-panel p-3 text-center group-hover:border-neon-purple/50 transition-all duration-500">
        <div className="text-neon-purple font-black group-hover:text-white transition-all duration-500">
            IDEAS
        </div>
        <div className="text-[10px] uppercase text-white/40 group-hover:text-neon-purple transition-all duration-500">
            Suggestions
        </div>
    </div>

    <div className="glass-panel p-3 text-center group-hover:border-neon-green/50 transition-all duration-500">
        <div className="text-neon-green font-black group-hover:text-white transition-all duration-500">
            EVENTS
        </div>
        <div className="text-[10px] uppercase text-white/40 group-hover:text-neon-green transition-all duration-500">
            Feedback
        </div>
    </div>

    <div className="glass-panel p-3 text-center group-hover:border-[#FFD700]/50 transition-all duration-500">
        <div className="text-[#FFD700] font-black group-hover:text-white transition-all duration-500">
            TRS
        </div>
        <div className="text-[10px] uppercase text-white/40 group-hover:text-[#FFD700] transition-all duration-500">
            Community
        </div>
    </div>

</div>
                <div className="mb-8 p-5 bg-neon-red/5 border border-neon-red/20 rounded-lg">
                    <div className="flex items-start gap-3 mb-3 group">
                        <AlertTriangle className="text-neon-red/50 w-5 h-5 flex-shrink-0 mt-0.5 group-hover:text-neon-red transition-all duration-500" />
                        <h3 className="text-neon-red/50 font-bold uppercase tracking-widest text-[1 rem] group-hover:text-neon-red transition-all duration-500">Reporting & Complaints</h3>
                    </div>
                    <p className="text-white/50 text-sm mb-4 leading-relaxed hover:text-white transition-all duration-500">
                        If a player is repeatedly misbehaving, disrupting car meets, breaking crew rules, or if you have any complaint related to crew activities, you may use this feedback form to report the issue. Please provide complete and accurate details so the matter can be reviewed fairly.
                    </p>
                    <div className="bg-black/40 p-4 rounded text-xs text-white/60 font-mono leading-loose border border-white/5 relative group">
                        <p><span className="text-neon-purple/70">Name:</span></p>
                        <p><span className="text-neon-purple/70">Reported Player:</span></p>
                        <p><span className="text-neon-purple/70">Date:</span></p>
                        <p><span className="text-neon-purple/70">Location / Event Name:</span></p>
                        <p><span className="text-neon-purple/70">Complaint Type:</span></p>
                        <p><span className="text-neon-purple/70">Description of the Incident:</span></p>
                        <p><span className="text-neon-purple/70">Requested Action:</span></p>
                        
                        <button 
                            type="button"
                            onClick={() => {
                                const template = `Name: \nReported Player: \nDate: \nLocation / Event Name: \nComplaint Type: \nDescription of the Incident: \nProof / Evidence: \nRequested Action: `;
                                setText(text ? text + '\n\n' + template : template);
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-neon-purple/50 hover:text-white text-white/40 rounded transition-all duration-500 group-hover:opacity-100 flex items-center gap-2 text-[10px] uppercase font-bold"
                            title="Copy Template to Input"
                        >
                            <FileText size={14} /> Use Template
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Message</label>
                        <textarea 
                            required 
                            rows="6"
                            value={text} 
                            onChange={e => setText(e.target.value)} 
                            className="w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-white focus:outline-none hover:border-neon-purple/50 focus:border-neon-purple/75 transition-colors resize-none" 
                            placeholder="Describe your suggestion, report, complaint, or event feedback..."
                        ></textarea>
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded text-sm text-center font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <button 
                        disabled={loading}
                        type="submit" 
                        className={`w-full py-4 text-deep-black text-sm font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(176, 38, 255, 0.8)] ${loading ? 'bg-neon-purple/25 cursor-not-allowed flex justify-center items-center gap-2' : 'bg-neon-purple hover:bg-neon-purple/50 hover:text-white/75 hover:shadow-[0_0_25px_rgba(176, 38, 255, 0.8)]'}`}
                    >
                        {loading ? <><Loader2 className="animate-spin" size={18} /> Submitting...</> : 'Send To Command Center'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default SubmitFeedback;