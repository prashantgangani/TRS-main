import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config";
import { logAdminAction } from "../utils/logger";

const AdminAddMeet = ({ isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const editMeet = location.state?.editMeet || null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [formData, setFormData] = useState(
    editMeet
      ? {
          theme: editMeet.theme || "",
          date: editMeet.date || "",
          time: editMeet.time || "",
          location: editMeet.location || "",
          dressCode: editMeet.dressCode || "",
          car: editMeet.car || "",
          cmlLead: editMeet.cmlLead || "",
          host: editMeet.host || "",
          description: editMeet.description || "",
          rules: editMeet.rules || "",
          image: editMeet.image || "",
        }
      : {
          theme: "",
          date: "",
          time: "",
          location: "",
          dressCode: "",
          car: "",
          cmlLead: "",
          host: "",
          description: "",
          rules: "",
          image: "",
        },
  );

  React.useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMeet = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editMeet
        ? `${API_URL}/meets/${editMeet._id}`
        : `${API_URL}/meets`;
      const method = editMeet ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const actionName = editMeet ? "Updated Meet" : "Created Meet";
        const actionDetails = editMeet
          ? `Theme: ${editMeet.theme} to ${formData.theme}`
          : `Theme: ${formData.theme} | Date: ${formData.date}`;
        await logAdminAction(actionName, actionDetails);
        navigate("/");
      } else {
        console.error("Failed to add meet");
      }
    } catch (error) {
      console.error("Error adding meet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 md:p-12 rounded-l border border-neon-purple/30 relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 blur-3xl -z-10 rounded-full"></div>

          <h1
            className="
text-4xl
md:text-6xl

font-black
font-heading

tracking-tight

mb-3
"
          >
            <span
              className="
    bg-gradient-to-r
    from-white
    via-electric-blue
    to-neon-purple

    bg-clip-text

    text-transparent
    "
            >
              {editMeet ? "Update" : "Publish"}
            </span>

            <span className="text-white"> Meet Intel</span>
          </h1>
          <div className="flex items-center gap-3 mb-10">
            <div
              className="
    w-2
    h-2

    rounded-full

    bg-electric-blue

    animate-pulse

    shadow-[0_0_15px_rgba(0,229,255,0.8)]
    "
            />

            <p
              className="
    text-electric-blue/80

    text-sm

    uppercase

    tracking-[0.3em]

    font-bold
    "
            >
              Official Dispatch Console
            </p>
          </div>

          <form onSubmit={handleAddMeet} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">
                  Theme
                </label>
                <input
                  required
                  type="text"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] rounded-l px-4 py-3 text-sm text-white focus:outline-none hover:border-electric-blue/40 hover:bg-white/[0.03] focus:border-neon-purple
 focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-all duration-300"
                  placeholder="e.g. Midnight Muscle"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">
                  Location
                </label>
                <input
                  required
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] rounded-l px-4 py-3 text-sm text-white focus:outline-none hover:border-electric-blue/40 hover:bg-white/[0.03] focus:border-neon-purple
 focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-all duration-300"
                  placeholder="e.g. Cypress Flats"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">
                  Date
                </label>
                <input
                  required
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] rounded-l px-4 py-3 text-sm text-white focus:outline-none hover:border-electric-blue/40 hover:bg-white/[0.03] focus:border-neon-purple
 focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-all duration-300"
                  placeholder="e.g. 24th October"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">
                  Time
                </label>
                <input
                  required
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] rounded-l px-4 py-3 text-sm text-white focus:outline-none hover:border-electric-blue/40 hover:bg-white/[0.03] focus:border-neon-purple
 focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-all duration-300"
                  placeholder="e.g. 10:00 PM EST"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">
                  Dress Code
                </label>
                <input
                  required
                  type="text"
                  name="dressCode"
                  value={formData.dressCode}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] rounded-l px-4 py-3 text-sm text-white focus:outline-none hover:border-electric-blue/40 hover:bg-white/[0.03] focus:border-neon-purple
 focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-all duration-300"
                  placeholder="e.g. Tuner Casual"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">
                  Car Required
                </label>
                <input
                  required
                  type="text"
                  name="car"
                  value={formData.car}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] rounded-l px-4 py-3 text-sm text-white focus:outline-none hover:border-electric-blue/40 hover:bg-white/[0.03] focus:border-neon-purple
 focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-all duration-300"
                  placeholder="e.g. JDM Only"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">
                  Cml/Lead
                </label>
                <input
                  required
                  type="text"
                  name="cmlLead"
                  value={formData.cmlLead}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] rounded-l px-4 py-3 text-sm text-white focus:outline-none hover:border-electric-blue/40 hover:bg-white/[0.03] focus:border-neon-purple
 focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-all duration-300"
                  placeholder="Crew Management Lead"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">
                  Host
                </label>

                <input
                  required
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  className="
        w-full

        bg-black/50

        border
        border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)]

        rounded-l

        px-5
        py-3

        text-sm

        text-white

        hover:border-electric-blue/40
        hover:bg-white/[0.03]

        focus:outline-none
        focus:border-neon-purple

        focus:shadow-[0_0_20px_rgba(176,38,255,0.15)]

        transition-all
        duration-300
        "
                  placeholder="Host Tag/Name"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">
                  Cover Image Path
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="
        w-full

        bg-black/50

        border
        border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)]

        rounded-l

        px-5
        py-3

        text-sm

        text-white

        hover:border-electric-blue/40
        hover:bg-white/[0.03]

        focus:outline-none
        focus:border-neon-purple

        focus:shadow-[0_0_20px_rgba(176,38,255,0.15)]

        transition-all
        duration-300
        "
                  placeholder="e.g. /images/meet1.jpg (Leave empty for default)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">
                Description
              </label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full bg-black/50 border border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] rounded-l px-4 py-3 text-sm text-white focus:outline-none hover:border-electric-blue/40 hover:bg-white/[0.03] focus:border-neon-purple
 focus:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-all duration-300 resize-none"
                placeholder="Enter a brief background or lore description for this meet..."
              ></textarea>
            </div>

            <div
              className="
group

glass-panel

p-6

rounded-l

border
border-white/10

hover:border-whtie/40
hover:bg-white/[0.03]

group-focus-within:border-neon-purple
group-focus-within:shadow-[0_0_25px_rgba(176,38,255,0.20)]

transition-all
duration-300
"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3
                    className="
            text-lg
            font-black
            tracking-wide
            text-white
            "
                  >
                    Rules & Operations
                  </h3>

                  <p
                    className="
            text-xs
            uppercase
            tracking-widest
            text-white/40
            mt-1
            "
                  >
                    Meet regulations and convoy intel
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`
    w-2
    h-2

    rounded-full

    animate-pulse

    ${
      formData.rules
        ? "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"
        : "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
    }
    `}
                    />

                    <span
                      className={`
    text-[10px]

    uppercase

    tracking-[0.25em]

    font-bold

    ${formData.rules ? "text-red-400" : "text-green-400"}
    `}
                    >
                      {formData.rules
                        ? `${formData.rules.split("\n").filter((r) => r.trim()).length} Rules Loaded`
                        : "No Rules Loaded"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplate("");

                    setFormData({
                      ...formData,
                      rules: "",
                    });
                  }}
                  className="
px-3
py-2

text-[10px]

uppercase
tracking-widest

border
border-red-500/20

rounded-l

text-neon-red

hover:bg-neon-red/80

hover:text-white

hover:tracking-[0.25em]

transition-all
duration-500
"
                >
                  Clear All Rules
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplate("car");

                    setFormData({
                      ...formData,
                      rules: `🚫 No ramming.
🚫 No weaponized cars.
🚫 No rocket boosts.
🚫 No armed variants.
🚨 Stay with convoy.
🚨 Follow host instructions.
🚨 Respect all members.
🚨 Maintain lane discipline.`,
                    });
                  }}
                  className={`
px-4
py-2

rounded-full

text-xs
font-bold

transition-all
duration-300

hover:scale-105

${
  selectedTemplate === "car"
    ? "bg-neon-purple/60 text-white border border-neon-purple shadow-[0_0_20px_rgba(176,38,255,0.35)] "
    : "bg-neon-purple/10 border border-neon-purple/20 hover:bg-neon-purple/20 "
}
`}
                >
                  Car Meet
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplate("bike");

                    setFormData({
                      ...formData,
                      rules: `🚫 No armored bikes.
🚫 No wheelies in convoy.
🚫 No weaponized bikes.
🚫 Nagasaki Shotaro, Western Rampant Rocket, Gargoyle etc. are not allowed.
🚨 Stay with convoy.
🚨 Clean riding, no reckless behavior.
🚨 Respect all members.
🚨 Maintain formation.`,
                    });
                  }}
                  className={`
px-4
py-2

rounded-full

text-xs
font-bold

transition-all
duration-300

hover:scale-105

${
  selectedTemplate === "bike"
    ? "bg-electric-blue/60 text-white border border-electric-blue shadow-[0_0_20px_rgba(0,229,255,0.35)]"
    : "bg-electric-blue/10 border border-electric-blue/20 hover:bg-electric-blue/20"
}
`}
                >
                  Bike Meet
                </button>
              </div>

              <textarea
                required
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                rows="8"
                className="
    w-full

    bg-black/40

    border
    border-white/10

    rounded-l

    px-5
    py-4

    text-sm

    text-white

    hover:border-electric-blue/40

    focus:outline-none
    focus:border-neon-purple

    focus:bg-black/50
    transition-all

    resize-y
    "
                placeholder="Select a template or write custom rules..."
              />
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="
px-8
py-3

border
border-red-500/20

rounded-l

backdrop-blur

bg-black

text-neon-red
hover:bg-neon-red/80

hover:text-white

hover:tracking-[0.2em]
hover:border-neon-red/40

transition-all
duration-500
"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                type="submit"
                className="
    relative

    overflow-hidden

    px-8
    py-3

    rounded-l

    bg-gradient-to-r
    from-neon-purple
    via-[#b026ff]
    to-electric-blue

    text-white

    text-sm
    font-bold

    uppercase
    tracking-widest

    shadow-[0_0_20px_rgba(176,38,255,0.35)]

    hover:-translate-y-1
    hover:scale-[1.02]

    hover:shadow-[0_0_35px_rgba(176,38,255,0.55)]

    transition-all
    duration-300

    group
    "
              >
                {/* Shimmer Effect */}
                <span
                  className="
        absolute
        inset-0

        bg-gradient-to-r

        from-transparent
        via-white/20
        to-transparent

        -skew-x-12

        -translate-x-full

        group-hover:translate-x-[200%]

        transition-transform
        duration-700
        "
                />

                <span className="relative z-10">
                  {isSubmitting
                    ? "TRANSMITTING..."
                    : editMeet
                      ? "UPDATE MEET"
                      : "PUBLISH MEET"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAddMeet;
