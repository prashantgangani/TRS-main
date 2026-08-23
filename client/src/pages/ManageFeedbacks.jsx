import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2,
    CheckCircle,
    MessageSquare,
    Clock,
    Copy,
    Check
} from 'lucide-react';
import { API_URL } from '../config';

const AnimatedCopyButton = ({ textToCopy }) => {

    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);

            setIsCopied(true);

            setTimeout(() => {
                setIsCopied(false);
            }, 2000);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="
            relative

            h-10
            w-10

            flex
            items-center
            justify-center

            rounded-xl

            border
            border-electric-blue/20

            bg-electric-blue/10

            hover:bg-electric-blue/60

            transition-all
            duration-500

            overflow-hidden
            
            group
            "
        >
            <AnimatePresence mode="wait">

                {isCopied ? (

                    <motion.div
                        key="check"
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                    >
                        <Check
                            size={18}
                            className="text-electric-blue group-hover:text-white/80 transition-all duration-500"
                        />
                    </motion.div>

                ) : (

                    <motion.div
                        key="copy"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <Copy
                            size={18}
                            className="text-electric-blue group-hover:text-white/80 transition-all duration-500 "
                        />
                    </motion.div>

                )}

            </AnimatePresence>

            {isCopied && (
                <motion.div
                    initial={{ opacity: 0.4, scale: 1 }}
                    animate={{ opacity: 0, scale: 2 }}
                    transition={{ duration: 0.5 }}
                    className="
                    absolute
                    inset-0

                    rounded-xl

                    bg-electric-blue/20
                    "
                />
            )}

        </button>
    );
};

const ManageFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch(`${API_URL}/feedbacks`);
            const data = await response.json();
            setFeedbacks(data);
        } catch (error) {
            console.error("Failed to fetch feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently delete this feedback?")) return;
        try {
            const response = await fetch(`${API_URL}/feedbacks/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setFeedbacks(feedbacks.filter(f => f._id !== id));
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    };

    const handleReview = async (id) => {
        try {
            const response = await fetch(`${API_URL}/feedbacks/${id}/review`, { method: 'PUT' });
            if (response.ok) {
                const updatedFeedback = await response.json();
                setFeedbacks(feedbacks.map(f => f._id === id ? updatedFeedback : f));
            }
        } catch (error) {
            console.error("Error reviewing feedback:", error);
        }
    };

    // Sort: Unreviewed first (top), then Reviewed (bottom), then by creation date.
    const sortedFeedbacks = [...feedbacks].sort((a, b) => {
        if (a.reviewed === b.reviewed) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.reviewed ? 1 : -1;
    });

    return (
        <section className="min-h-screen bg-deep-black pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none -z-10"></div>
            
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="px-3 py-1 rounded-sm text-xs uppercase tracking-widest text-electric-blue mb-4 inline-block hover:text-white hover:bg-electric-blue/60 transition-all duration-500 hover:tracking-[0.2em]">
                        Command Center
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white drop-shadow-lg">
                        Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-white to-electric-blue">Feedback</span>
                    </h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 group">

  <div className="glass-panel p-4 text-center">
    <div className="text-2xl font-black text-electric-blue group-hover:text-white transition-all duration-500">
      {feedbacks.length}
    </div>
    <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-electric-blue transition-all duration-500">
      Total
    </div>
  </div>

  <div className="glass-panel p-4 text-center">
    <div className="text-2xl font-black text-neon-red group-hover:text-white transition-all duration-500">
      {feedbacks.filter(f => !f.reviewed).length}
    </div>
    <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-neon-red transition-all duration-500">
      Pending
    </div>
  </div>

  <div className="glass-panel p-4 text-center">
    <div className="text-2xl font-black text-neon-green group-hover:text-white transition-all duration-500">
      {feedbacks.filter(f => f.reviewed).length}
    </div>
    <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-neon-green transition-all duration-500">
      Reviewed
    </div>
  </div>

  <div className="glass-panel p-4 text-center">
    <div className="text-2xl font-black text-neon-purple group-hover:text-white transition-all duration-500">
      TRS
    </div>
    <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-neon-purple transition-all duration-500">
      Communications
    </div>
  </div>

</div>
                </motion.div>

                {loading ? (
                    <div className="text-white/50 text-center py-10 tracking-widest uppercase text-sm">Loading Communications...</div>
                ) : (
                    <div className="space-y-4">
                        {sortedFeedbacks.length === 0 ? (
                            <div className="glass-panel p-10 text-center rounded-xl border border-white/10">
                                <MessageSquare className="mx-auto mb-4 text-white/30" size={48} />
                                <p className="text-white/50 text-sm tracking-widest uppercase">No feedback records found</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {sortedFeedbacks.map((feedback, index) => (
                                    <motion.div
                                        key={feedback._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className={`glass-panel p-6 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-500 ${
                                            feedback.reviewed 
                                                ? 'border-green-500/30 bg-green-500/5' 
                                                : 'border-white/10 hover:border-electric-blue/50'
                                        }`}
                                    >
                                        <div className="flex-1 w-full text-left">
                                            <div className="flex items-center gap-3 mb-2">
                                                {feedback.reviewed ? (
                                                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-neon-green font-bold bg-neon-green/10 px-2 py-1 rounded hover:text-white hover:bg-neon-green/60 transition-all duration-500">
                                                        <CheckCircle size={12} /> Reviewed
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-electric-blue font-bold bg-electric-blue/10 px-2 py-1 rounded">
                                                        <Clock size={12} /> Pending Review
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-neon-purple font-bold tracking-widest uppercase"> #FB-{index + 1} </span>
                                                <span className="text-[10px] text-white/40 tracking-widest uppercase hover:text-white transition-all duration-500">
                                                    {new Date(feedback.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className={`text-sm md:text-base leading-relaxed hover:text-white transition-all duration-500 ${feedback.reviewed ? 'text-white/60' : 'text-white/90'}`}>
                                                {feedback.text}
                                            </p>
                                        </div>
                                        
                                        <div className="flex gap-3 w-full md:w-auto shrink-0 justify-end">
                                            {!feedback.reviewed && (
                                                <button 
                                                    onClick={() => handleReview(feedback._id)} 
                                                    className="px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded border border-green-500/30 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider flex-1 md:flex-auto"
                                                >
                                                    <CheckCircle size={16} /> Mark Reviewed
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(feedback._id)} 
                                                className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded border border-red-500/30 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider flex-1 md:flex-auto"
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                            <AnimatedCopyButton
    textToCopy={feedback.text}
/>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ManageFeedbacks;