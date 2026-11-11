// =============================================================
// Space design data — edit this file to change the content.
// Rule: spaces are DESIGNED by our team; the website SHOWS them.
// Each design card has 3 elements: lighting, noise, seating.
// =============================================================

window.DESIGNS = [
  {
    id: "memorization",
    type: "Memorization",
    name: "Focus Room",
    tagline: "A calm, bright room for remembering details.",
    sound: "quiet",
    soundLabel: "Quiet room",
    elements: [
      {
        key: "Lighting",
        value: "Bright, even white light",
        reason: "Bright light suits careful, detailed work. Dim light helps free thinking more than memorizing.",
        cites: [{ label: "Steidle & Werth (2013)", url: "https://scholar.google.com/scholar?q=Steidle+Werth+2013+Freedom+from+constraints+darkness+and+dim+illumination+promote+creativity" }]
      },
      {
        key: "Noise",
        value: "Quiet, library level",
        reason: "Very loud noise (about 85 dB) makes it harder to process information.",
        cites: [{ label: "Mehta, Zhu & Cheema (2012)", url: "https://doi.org/10.1086/665048" }]
      },
      {
        key: "Seating",
        value: "Single desks under a lower ceiling",
        reason: "A lower ceiling tends to make people focus on details one by one.",
        cites: [{ label: "Meyers-Levy & Zhu (2007)", url: "https://doi.org/10.1086/519146" }]
      }
    ]
  },
  {
    id: "idea",
    type: "Idea generation",
    name: "Idea Lounge",
    tagline: "An open, softly lit space where ideas can wander.",
    sound: "cafe",
    soundLabel: "Café buzz (~70 dB feel)",
    elements: [
      {
        key: "Lighting",
        value: "Dim, warm light",
        reason: "Dim light makes people feel free from limits, which helps creative problem solving.",
        cites: [{ label: "Steidle & Werth (2013)", url: "https://scholar.google.com/scholar?q=Steidle+Werth+2013+Freedom+from+constraints+darkness+and+dim+illumination+promote+creativity" }]
      },
      {
        key: "Noise",
        value: "Café-level buzz (about 70 dB)",
        reason: "Moderate background noise led to the best scores on creative tasks.",
        cites: [{ label: "Mehta, Zhu & Cheema (2012)", url: "https://doi.org/10.1086/665048" }]
      },
      {
        key: "Seating",
        value: "High ceiling, lounge chairs, and a walking loop",
        reason: "High ceilings encourage broad thinking, and walking can greatly increase new ideas.",
        cites: [
          { label: "Meyers-Levy & Zhu (2007)", url: "https://doi.org/10.1086/519146" },
          { label: "Oppezzo & Schwartz (2014)", url: "https://doi.org/10.1037/a0036577" }
        ]
      }
    ],
    // 3D view (space3d.js). "ours" = our design, "compare" = the other option.
    view3d: {
      ceiling: { ours: 3.2, compare: 2.4 }, // meters
      light: {
        ours: { preset: "dimWarm", name: "dim, warm" },        // presets: LIGHTS in space3d.js
        compare: { preset: "brightOffice", name: "bright office" }
      },
      notes: {
        light: {
          ours: "Dim, warm light makes people feel free, which helps creative thinking.",
          compare: "Bright office light suits careful, detailed work. That's our Focus Room, not the Idea Lounge.",
          source: "Steidle & Werth, 2013"
        },
        ceiling: {
          ours: "A 3.2 m ceiling encourages broad, free thinking.",
          compare: "A 2.4 m ceiling makes people focus on details. Great for memorizing, less for new ideas.",
          source: "Meyers-Levy & Zhu, 2007"
        }
      }
    }
  },
  {
    id: "teamwork",
    type: "Teamwork",
    name: "Team Studio",
    tagline: "A lively room built for talking things through.",
    sound: "talk",
    soundLabel: "Group discussion",
    elements: [
      {
        key: "Lighting",
        value: "Bright, warm light",
        reason: "Light is one of the classroom factors linked to students' learning progress.",
        cites: [{ label: "Barrett et al. (2015)", url: "https://doi.org/10.1016/j.buildenv.2015.02.013" }]
      },
      {
        key: "Noise",
        value: "Conversation-friendly",
        reason: "Some background sound is better for creative thinking than complete silence.",
        cites: [{ label: "Mehta, Zhu & Cheema (2012)", url: "https://doi.org/10.1086/665048" }]
      },
      {
        key: "Seating",
        value: "Round tables and movable furniture",
        reason: "University students in collaborative classrooms did better than their grades predicted.",
        cites: [{ label: "Brooks (2011)", url: "https://scholar.google.com/scholar?q=Brooks+2011+Space+matters+impact+of+formal+learning+environments+on+student+learning" }]
      }
    ]
  },
  {
    id: "comfort",
    type: "Comfort",
    name: "Green Nook",
    tagline: "A soft, green corner to rest and reset.",
    sound: "nature",
    soundLabel: "Wind and birds",
    elements: [
      {
        key: "Lighting",
        value: "Natural daylight with green views",
        reason: "Looking at greenery for just 40 seconds helped university students stay focused.",
        cites: [{ label: "Lee et al. (2015)", url: "https://findanexpert.unimelb.edu.au/scholarlywork/977781-40-second-green-roof-views-sustain-attention--the-role-of-micro-breaks-in-attention-restoration" }]
      },
      {
        key: "Noise",
        value: "Soft nature sounds",
        reason: "Nature helps tired attention recover.",
        cites: [
          { label: "Kaplan (1995)", url: "https://doi.org/10.1016/0272-4944(95)90001-2" },
          { label: "Berman et al. (2008)", url: "https://doi.org/10.1111/j.1467-9280.2008.02225.x" }
        ]
      },
      {
        key: "Seating",
        value: "Sofas and beanbags",
        reason: "TODO: add our survey result about what makes students feel comfortable.",
        cites: []
      }
    ]
  }
];

window.KEY_FACT = {
  text: "Classroom features such as light, temperature, and layout explained about 16% of the differences in students' learning progress.",
  cite: { label: "Barrett et al. (2015)", url: "https://doi.org/10.1016/j.buildenv.2015.02.013" }
};
