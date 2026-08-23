import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Target,
  Plus,
  Car,
  User,
  Clock,
  ShieldAlert,
  X,
  Info,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { API_URL } from "../config";
import { logAdminAction } from "../utils/logger";
import LazyImage from "./LazyImage";
import universalImage from "/universal.jpg";

const UpcomingMeets = ({ isAdmin }) => {
  const [meets, setMeets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeet, setSelectedMeet] = useState(null);

  const navigate = useNavigate();

  const moveMeet = async (index, direction) => {
    if (!isAdmin) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= meets.length) return;

    const newMeets = [...meets];
    const temp = newMeets[index];
    newMeets[index] = newMeets[newIndex];
    newMeets[newIndex] = temp;

    setMeets(newMeets);

    try {
      const orderedIds = newMeets.map((m) => m._id);
      await fetch(`${API_URL}/meets/update-order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      await logAdminAction(
        "Rearranged Meets",
        `Moved ${temp.theme} ${direction}`,
      );
    } catch (err) {
      console.error("Failed to reorder meets:", err);
      // Optionally, revert the state if the update fails
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedMeet) {
      document.body.style.overflow = "hidden";

      // Add ESC key listener
      const handleEsc = (e) => {
        if (e.key === "Escape") setSelectedMeet(null);
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedMeet]);

  useEffect(() => {
    const fetchMeets = async () => {
      try {
        const response = await fetch(`${API_URL}/meets`);
        const data = await response.json();

        console.log("Response:", data);
        console.log("Is Array?", Array.isArray(data));

        setMeets(data);

        console.log("Meet API Response:", data);

        setMeets(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch meets:", error);
        setMeets([]);
        setLoading(false);
      }
    };

    fetchMeets();
  }, []);

  return (
    <section
      id="meets"
      className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10"
    >
      <div
        className="
absolute
inset-0

flex
items-center
justify-center

pointer-events-none
select-none

text-[40vw]
font-black

text-white/[0.04]

z-0
"
      >
        TRS
      </div>
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div
            className="
        inline-flex
        items-center
        gap-2

        mb-4

        px-4
        py-2

        rounded-full

        border
        border-neon-purple/20

        bg-neon-purple/5

        hover:bg-neon-purple
        transition-all
        duration-500

        group
        "
          >
            <div
              className="
            w-2
            h-2

            rounded-full

            bg-neon-purple

            animate-pulse

            group-hover:bg-neon-red
            transition-all
            duration-500
            "
            />

            <span
              className="
            text-[10px]

            uppercase

            tracking-[0.3em]

            text-neon-purple

            group-hover:tracking-[0.5em]

            group-hover:text-white
            transition-all
            duration-500
            "
            >
              Upcoming Operations
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-glow mb-4">
            Upcoming{" "}
            <span className="text-transparent bg-gradient-to-r from-white via-transparent to-neon-purple animate-gradient-x bg-[length:400%_auto] bg-clip-text">
              Meets
            </span>
          </h2>

          <p className="text-white/60 text-lg max-w-2xl hover:text-white transition-all duration-500">
            Official TRS dispatch schedule. Prepare your build, check
            requirements, and report to the next convoy.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => navigate("/previous-meets")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black border border-white/20 rounded-full hover:tracking-[0.25em] hover:text-neon-purple hover:border-neon-purple hover:bg-white transition-all duration-500 font-bold tracking-widest text-sm uppercase whitespace-nowrap group"
          >
            <Clock
              size={18}
              className="text-white/70 group-hover:text-neon-purple transition-all duration-500"
            />
            Previous Meets
          </button>

          <button
            onClick={() => navigate("/valid-cars")}
            className="
    flex
    items-center
    justify-center
    gap-2

    px-6
    py-3

    rounded-full

    border
    border-neon-purple/20

    bg-neon-purple/5

    hover:bg-neon-purple
    hover:border-neon-purple

    text-neon-purple
    hover:text-white

    font-bold
    text-sm

    uppercase
    tracking-widest

    transition-all
    duration-500

    hover:tracking-[0.2em]
    "
          >
            <Car size={18} />
            Valid Vehicle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* ADMIN ONLY: ADD NEW MEET ACTION CARD */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 rounded-sm border-2 border-dashed border-neon-purple/50 bg-neon-purple/5 relative flex flex-col justify-center items-center text-center min-h-[300px] group"
          >
            <h3 className="text-xl font-bold mb-4 font-heading text-neon-purple/50 flex items-center gap-2 group-hover:text-neon-purple transition-all duration-500">
              <Plus size={20} /> Publish New Meet
            </h3>
            <p className="text-white/50 text-sm mb-6 group-hover:text-white transition-all duration-500">
              Enter official dispatch interface to detail Theme, Date, Time,
              Location, Meet Type, Dress Code, Vehicle Requirements, Cml/Lead,
              Rules, and Host.
            </p>

            <button
              onClick={() => navigate("/admin/add-meet")}
              className="w-full py-4 bg-neon-purple/40 hover:bg-neon-purple/80 text-white/40 group-hover:text-white text-sm font-bold uppercase tracking-widest rounded transition-all duration-500 shadow-[0_0_15px_rgba(176,38,255,0.4)]"
            >
              Open Console
            </button>
          </motion.div>
        )}

        {loading ? (
          <div className="text-white/50 col-span-3 text-center py-10 tracking-widest uppercase text-sm">
            Loading Underground Intel...
          </div>
        ) : (
          meets.map((meet, index) => (
            <motion.div
              key={meet._id || index}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                layout: { duration: 0.3 },
              }}
              className="
glass-panel
p-6
rounded-xl

group

hover:border-neon-purple/50
hover:-translate-y-2
hover:shadow-[0_20px_50px_rgba(176,38,255,0.15)]

transition-all
duration-500

overflow-hidden
relative
flex
flex-col
"
            >
              {/* Background Image on Card */}
              <div className="absolute inset-0 z-0 overflow-hidden opacity-20 transition-opacity duration-700 group-hover:opacity-40">
                <LazyImage
                  src={meet.image}
                  fallbackSrc={universalImage}
                  variant="card"
                  alt="Meet Thumbnail"
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/80 to-transparent" />
              </div>

              {/* Subtle glow effect behind card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl -z-10 group-hover:bg-neon-purple/20 transition-all duration-500"></div>

              {isAdmin && (
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveMeet(index, "up");
                    }}
                    disabled={index === 0}
                    className="p-2 bg-transparent hover:bg-neon-purple/80 text-neon-purple hover:text-white rounded-lg transition-all duration-500 backdrop-blur-sm z-30 relative disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Earlier"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveMeet(index, "down");
                    }}
                    disabled={index === meets.length - 1}
                    className="p-2 bg-transparent hover:bg-neon-purple/80 text-neon-purple hover:text-white rounded-lg transition-all duration-500 backdrop-blur-sm z-30 relative disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Later"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/admin/add-meet", {
                        state: { editMeet: meet },
                      });
                    }}
                    className="p-2 bg-transparent hover:bg-electric-blue/80 text-electric-blue hover:text-white rounded-lg transition-all duration-500 backdrop-blur-sm z-30 relative"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!window.confirm("Delete this meet?")) return;
                      try {
                        const response = await fetch(
                          `${API_URL}/meets/${meet._id}`,
                          { method: "DELETE" },
                        );
                        if (response.ok) {
                          setMeets(meets.filter((m) => m._id !== meet._id));
                          await logAdminAction(
                            "Deleted Meet",
                            `Theme: ${meet.theme}`,
                          );
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="p-2 bg-transparent hover:bg-neon-red/80 text-neon-red hover:text-white rounded-lg transition-all duration-500 backdrop-blur-sm z-30 relative"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <div className="relative z-10 flex flex-col flex-1 mt-6 group:">
                <div className="mb-4" />

                <h3
                  className="
text-3xl
font-black
mb-6
font-heading

group-hover:text-neon-purple

transition-all
duration-300

drop-shadow-md
"
                >
                  {meet.theme || meet.title}
                </h3>

                <div className="space-y-4 mb-6 text-white/50 flex-1 drop-shadow-md">
                  <div className="flex items-center gap-3">
                    <Calendar
                      className="text-neon-purple/25 group-hover:text-neon-purple transition-all duration-500"
                      size={16}
                    />
                    <span className="text-sm font-medium group-hover:text-white transition-all duration-500">
                      {meet.date}
                      <span className="text-white/50 group-hover:text-white transition-all duration-500">
                        {" "}
                        |{" "}
                      </span>
                      {meet.time || "TBA"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin
                      className="text-electric-blue/25 group-hover:text-electric-blue transition-all duration-500"
                      size={16}
                    />
                    <span className="text-sm font-medium group-hover:text-white transition-all duration-500">
                      {meet.location}
                    </span>
                  </div>

                  {/* Dispatch Status */}
                  <div
                    className="
        inline-flex

        items-center
        gap-2

        px-3
        py-1

        rounded-lg

        bg-electric-blue/25

        border
        border-electric-blue/20

        group-hover:bg-electric-blue/75
        group-hover:border-electric-blue/80
        transition-all 
        duration-500
        "
                  >
                    <div
                      className="
            w-2
            h-2

            rounded-full

            bg-electric-blue

            animate-pulse

            group-hover:bg-neon-red
            transition-all 
            duration-500
            "
                    />

                    <span
                      className="
            text-[10px]

            uppercase

            tracking-widest

            text-electric-blue

            font-bold

            group-hover:text-white
            transition-all 
            duration-500
            "
                    >
                      Come, Let's have some fun
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMeet(meet)}
                  className="w-full py-3 mt-auto rounded-lg border border-white/10 hover:border-neon-purple text-white/70 hover:text-white text-sm font-bold uppercase tracking-widest bg-black/40 hover:bg-neon-purple/50 backdrop-blur-sm  hover:tracking-[0.2em] transition-all duration-500"
                >
                  SEE DETAILS
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL DIALOG */}
      {createPortal(
        <AnimatePresence>
          {selectedMeet && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-deep-black/90 backdrop-blur-md"
              onClick={() => setSelectedMeet(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel border border-white/10 rounded-xl relative overflow-hidden flex flex-col hide-scrollbar"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMeet(null)}
                  className="
fixed
top-6
right-6

z-[999]

p-3

bg-black/80
hover:bg-neon-red/20

text-white
hover:text-neon-red

rounded-full

transition-all
duration-300

hover:rotate-180
hover:scale-120
hover:shadow-[0_0_20px_rgba(255,60,60,0.5)]

backdrop-blur-md

border
border-white/10

shadow-lg
"
                >
                  <X size={24} />
                </button>

                {/* Modal Header / Cover Image */}
                <div className="relative w-full h-64 md:h-80 shrink-0 group">
                  <LazyImage
                    src={selectedMeet.image}
                    variant="detail"
                    fallbackSrc={universalImage}
                    className="grayscale group-hover:grayscale-0"
                    alt="Cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedMeet.dressCode && (
                        <div
                          className="
            px-3
            py-1

            rounded-full

            bg-electric-blue/20
            border
            border-electric-blue/40

            text-[10px]
            uppercase
            tracking-widest

            text-electric-blue
            font-bold
            "
                        >
                          {selectedMeet.dressCode}
                        </div>
                      )}

                      {selectedMeet.car && (
                        <div
                          className="
            px-3
            py-1

            rounded-full

            bg-white/10
            border
            border-white/20

            text-[10px]
            uppercase
            tracking-widest

            text-white/80
            font-bold
            "
                        >
                          {selectedMeet.car}
                        </div>
                      )}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight text-white drop-shadow-lg text-glow">
                      {selectedMeet.theme || selectedMeet.title}
                    </h2>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 md:p-10 bg-[#0a0a0a] flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Column: Core Logistics */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-electric-blue mb-3 font-bold border-l-2 border-electric-blue pl-2">
                          Time & Location
                        </h4>
                        <div className="space-y-3 bg-white/5 p-4 rounded border border-white/5">
                          <div className="flex items-center gap-3">
                            <Calendar className="text-white/60" size={18} />
                            <span className="text-sm font-medium text-white">
                              {selectedMeet.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="text-white/60" size={18} />
                            <span className="text-sm font-medium text-white">
                              {selectedMeet.time || "TBA"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="text-white/60" size={18} />
                            <span className="text-sm font-medium text-white">
                              {selectedMeet.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-neon-purple mb-3 font-bold border-l-2 border-neon-purple pl-2">
                          Requirements & Command
                        </h4>
                        <div className="space-y-3 bg-white/5 p-4 rounded border border-white/5">
                          {selectedMeet.car && (
                            <div className="flex items-center gap-3">
                              <Car className="text-white/60" size={18} />
                              <span className="text-sm text-white/60">
                                Vehicle:{" "}
                                <span className="font-bold text-white">
                                  {selectedMeet.car}
                                </span>
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <Target className="text-neon-red" size={18} />
                            <span className="text-sm text-white/60">
                              Host:{" "}
                              <span className="font-bold text-white">
                                {selectedMeet.host || "System Admin"}
                              </span>
                            </span>
                          </div>
                          {selectedMeet.cmlLead && (
                            <div className="flex items-center gap-3">
                              <User className="text-white/60" size={18} />
                              <span className="text-sm text-white/60">
                                Lead:{" "}
                                <span className="font-bold text-white">
                                  {selectedMeet.cmlLead}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Lore & Rules */}
                    <div className="space-y-8">
                      {selectedMeet.description && (
                        <div>
                          <div className="flex items-center gap-2 mb-3 text-white">
                            <Info size={16} />
                            <h4 className="text-xs uppercase tracking-widest font-bold">
                              Briefing
                            </h4>
                          </div>
                          <p className="text-sm text-white/70 leading-relaxed bg-white/5 p-4 rounded border border-white/5 whitespace-pre-wrap">
                            {selectedMeet.description}
                          </p>
                        </div>
                      )}

                      {selectedMeet.rules && (
                        <div>
                          <div className="flex items-center gap-2 mb-3 text-neon-red">
                            <ShieldAlert size={16} />
                            <h4 className="text-xs uppercase tracking-widest font-bold">
                              Official Rules
                            </h4>
                          </div>
                          <p className="text-sm text-white/70 leading-relaxed bg-neon-red/5 p-4 rounded border border-neon-red/20 whitespace-pre-wrap">
                            {selectedMeet.rules}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
};

export default UpcomingMeets;
