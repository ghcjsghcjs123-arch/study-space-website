// =============================================================
// Space design data — edit this file to change the content.
// Rule: spaces are DESIGNED by our team; the website SHOWS them.
// Each design card has 3 elements: lighting, noise, seating.
//
// LANGUAGES: every text that people read is { en: "...", ko: "..." }.
// Keep both languages when you edit. Do NOT translate:
//   - space names (Focus Room, Idea Lounge, Team Studio, Green Nook)
//   - study names (cites.label, source) and links (url)
// Korean study types: 암기, 아이디어 구상, 팀플, 편안함.
// =============================================================

(() => {
  // the three element names, shared by all cards
  const KEY = {
    lighting: { en: "Lighting", ko: "조명" },
    noise: { en: "Noise", ko: "소음" },
    seating: { en: "Seating", ko: "좌석" }
  };

  const STUDY = {
    steidle: { label: "Steidle & Werth (2013)", url: "https://scholar.google.com/scholar?q=Steidle+Werth+2013+Freedom+from+constraints+darkness+and+dim+illumination+promote+creativity" },
    mehta: { label: "Mehta, Zhu & Cheema (2012)", url: "https://doi.org/10.1086/665048" },
    meyers: { label: "Meyers-Levy & Zhu (2007)", url: "https://doi.org/10.1086/519146" },
    oppezzo: { label: "Oppezzo & Schwartz (2014)", url: "https://doi.org/10.1037/a0036577" },
    barrett: { label: "Barrett et al. (2015)", url: "https://doi.org/10.1016/j.buildenv.2015.02.013" },
    brooks: { label: "Brooks (2011)", url: "https://scholar.google.com/scholar?q=Brooks+2011+Space+matters+impact+of+formal+learning+environments+on+student+learning" },
    lee: { label: "Lee et al. (2015)", url: "https://findanexpert.unimelb.edu.au/scholarlywork/977781-40-second-green-roof-views-sustain-attention--the-role-of-micro-breaks-in-attention-restoration" },
    kaplan: { label: "Kaplan (1995)", url: "https://doi.org/10.1016/0272-4944(95)90001-2" },
    berman: { label: "Berman et al. (2008)", url: "https://doi.org/10.1111/j.1467-9280.2008.02225.x" }
  };

  window.DESIGNS = [
    {
      id: "memorization",
      type: { en: "Memorization", ko: "암기" },
      name: "Focus Room",
      tagline: {
        en: "A calm, bright room for remembering details.",
        ko: "세세한 내용을 기억하기 좋은, 차분하고 밝은 방이에요."
      },
      sound: "quiet",
      soundLabel: { en: "Quiet room", ko: "조용한 방" },
      elements: [
        {
          key: KEY.lighting,
          value: { en: "Bright, even white light", ko: "밝고 고른 흰빛" },
          reason: {
            en: "Bright light suits careful, detailed work. Dim light helps free thinking more than memorizing.",
            ko: "밝은 빛은 꼼꼼하고 세밀한 작업에 잘 맞아요. 어둑한 빛은 암기보다 자유로운 생각에 더 도움이 돼요."
          },
          cites: [STUDY.steidle]
        },
        {
          key: KEY.noise,
          value: { en: "Quiet, library level", ko: "도서관처럼 조용함" },
          reason: {
            en: "Very loud noise (about 85 dB) makes it harder to process information.",
            ko: "아주 큰 소음(약 85 dB)은 정보를 처리하기 어렵게 만들어요."
          },
          cites: [STUDY.mehta]
        },
        {
          key: KEY.seating,
          value: { en: "Single desks under a lower ceiling", ko: "낮은 천장 아래 1인 책상" },
          reason: {
            en: "A lower ceiling tends to make people focus on details one by one.",
            ko: "낮은 천장은 세부 내용에 하나씩 집중하게 만드는 경향이 있어요."
          },
          cites: [STUDY.meyers]
        }
      ],
      // 3D view (space3d.js). "ours" = our design, "compare" = the other option.
      view3d: {
        ceiling: { ours: 2.4, compare: 3.2 }, // meters
        light: {
          ours: { preset: "brightOffice", name: { en: "bright, even white", ko: "밝고 고른 흰빛" } }, // presets: LIGHTS in space3d.js
          compare: { preset: "dimWarm", name: { en: "dim, orange", ko: "어둑한 주황빛" } }
        },
        // source is shown as "(Author, year)" — use only studies already listed in this file
        notes: {
          light: {
            ours: {
              text: {
                en: "Bright, even light suits careful, detailed work like memorizing.",
                ko: "밝고 고른 빛은 암기처럼 꼼꼼하고 세밀한 작업에 잘 맞아요."
              }
            },
            compare: {
              text: {
                en: "Dim, warm light is better for free thinking. That's our Idea Lounge.",
                ko: "어둑하고 따뜻한 빛은 자유로운 생각에 더 좋아요. 그건 우리의 Idea Lounge예요."
              },
              source: "Steidle & Werth, 2013"
            }
          },
          ceiling: {
            ours: {
              text: {
                en: "A 2.4 m ceiling helps people focus on details one by one.",
                ko: "2.4 m 천장은 세부 내용에 하나씩 집중하도록 도와줘요."
              },
              source: "Meyers-Levy & Zhu, 2007"
            },
            compare: {
              text: {
                en: "A high ceiling makes thoughts wander more broadly. Better for ideas, not memorizing.",
                ko: "높은 천장은 생각을 더 넓게 펼치게 해요. 암기보다는 아이디어 구상에 어울려요."
              }
            }
          }
        }
      }
    },
    {
      id: "idea",
      type: { en: "Idea generation", ko: "아이디어 구상" },
      name: "Idea Lounge",
      tagline: {
        en: "An open, softly lit space where ideas can wander.",
        ko: "생각이 자유롭게 뻗어 나가는, 탁 트이고 은은한 공간이에요."
      },
      sound: "cafe",
      soundLabel: { en: "Café buzz (~70 dB feel)", ko: "카페 소음 (~70 dB 느낌)" },
      elements: [
        {
          key: KEY.lighting,
          value: { en: "Dim, warm light", ko: "어둑하고 따뜻한 빛" },
          reason: {
            en: "Dim light makes people feel free from limits, which helps creative problem solving.",
            ko: "어둑한 빛은 제약에서 벗어난 느낌을 줘서 창의적인 문제 해결에 도움이 돼요."
          },
          cites: [STUDY.steidle]
        },
        {
          key: KEY.noise,
          value: { en: "Café-level buzz (about 70 dB)", ko: "카페 정도의 웅성거림 (약 70 dB)" },
          reason: {
            en: "Moderate background noise led to the best scores on creative tasks.",
            ko: "적당한 배경 소음이 있을 때 창의력 과제 점수가 가장 높았어요."
          },
          cites: [STUDY.mehta]
        },
        {
          key: KEY.seating,
          value: { en: "High ceiling, lounge chairs, and a walking loop", ko: "높은 천장, 라운지 의자, 걷는 동선" },
          reason: {
            en: "High ceilings encourage broad thinking, and walking can greatly increase new ideas.",
            ko: "높은 천장은 생각을 넓게 펼치게 하고, 걷기는 새로운 아이디어를 크게 늘려 줄 수 있어요."
          },
          cites: [STUDY.meyers, STUDY.oppezzo]
        }
      ],
      view3d: {
        ceiling: { ours: 3.2, compare: 2.4 },
        light: {
          ours: { preset: "dimWarm", name: { en: "dim, warm", ko: "어둑하고 따뜻한 빛" } },
          compare: { preset: "brightOffice", name: { en: "bright office", ko: "밝은 사무실 빛" } }
        },
        notes: {
          light: {
            ours: {
              text: {
                en: "Dim, warm light makes people feel free, which helps creative thinking.",
                ko: "어둑하고 따뜻한 빛은 마음을 자유롭게 해서 창의적인 생각에 도움이 돼요."
              },
              source: "Steidle & Werth, 2013"
            },
            compare: {
              text: {
                en: "Bright office light suits careful, detailed work. That's our Focus Room, not the Idea Lounge.",
                ko: "밝은 사무실 빛은 꼼꼼하고 세밀한 작업에 맞아요. 그건 Idea Lounge가 아니라 우리의 Focus Room이에요."
              },
              source: "Steidle & Werth, 2013"
            }
          },
          ceiling: {
            ours: {
              text: {
                en: "A 3.2 m ceiling encourages broad, free thinking.",
                ko: "3.2 m 천장은 넓고 자유로운 생각을 이끌어 줘요."
              },
              source: "Meyers-Levy & Zhu, 2007"
            },
            compare: {
              text: {
                en: "A 2.4 m ceiling makes people focus on details. Great for memorizing, less for new ideas.",
                ko: "2.4 m 천장은 세부 내용에 집중하게 해요. 암기에는 좋지만 새로운 아이디어에는 덜 맞아요."
              },
              source: "Meyers-Levy & Zhu, 2007"
            }
          }
        }
      }
    },
    {
      id: "teamwork",
      type: { en: "Teamwork", ko: "팀플" },
      name: "Team Studio",
      tagline: {
        en: "A lively room built for talking things through.",
        ko: "함께 이야기하며 답을 찾아가는 활기찬 방이에요."
      },
      sound: "talk",
      soundLabel: { en: "Group discussion", ko: "그룹 토론" },
      elements: [
        {
          key: KEY.lighting,
          value: { en: "Bright, warm light", ko: "밝고 따뜻한 빛" },
          reason: {
            en: "Light is one of the classroom factors linked to students' learning progress.",
            ko: "빛은 학생들의 학습 향상과 관련된 교실 요인 중 하나예요."
          },
          cites: [STUDY.barrett]
        },
        {
          key: KEY.noise,
          value: { en: "Conversation-friendly", ko: "대화하기 편한 소리" },
          reason: {
            en: "Some background sound is better for creative thinking than complete silence.",
            ko: "완전히 조용한 것보다 어느 정도 배경 소리가 있는 편이 창의적인 생각에 더 좋아요."
          },
          cites: [STUDY.mehta]
        },
        {
          key: KEY.seating,
          value: { en: "Round tables and movable furniture", ko: "둥근 테이블과 옮길 수 있는 가구" },
          reason: {
            en: "University students in collaborative classrooms did better than their grades predicted.",
            ko: "협업형 강의실에서 공부한 대학생들은 기존 성적으로 예상한 것보다 더 좋은 결과를 냈어요."
          },
          cites: [STUDY.brooks]
        }
      ],
      view3d: {
        ceiling: { ours: 3.0, compare: 2.4 },
        light: {
          ours: { preset: "brightWarm", name: { en: "bright, warm", ko: "밝고 따뜻한 빛" } },
          compare: { preset: "dim", name: { en: "dim", ko: "어둑한 빛" } }
        },
        notes: {
          light: {
            ours: {
              text: {
                en: "Bright, warm light helps everyone see faces and shared screens. Light is one of the classroom factors linked to learning.",
                ko: "밝고 따뜻한 빛은 모두가 서로의 얼굴과 공유 화면을 잘 보게 해 줘요. 빛은 학습과 관련된 교실 요인 중 하나예요."
              },
              source: "Barrett et al., 2015"
            },
            compare: {
              text: {
                en: "Dim light makes it harder to read faces and screens during group work.",
                ko: "어둑한 빛에서는 팀플 중에 서로의 얼굴과 화면을 알아보기 어려워요."
              }
            }
          },
          ceiling: {
            ours: {
              text: {
                en: "An open 3.0 m ceiling keeps a lively room from feeling crowded.",
                ko: "탁 트인 3.0 m 천장은 활기찬 방이 북적이는 느낌을 덜어 줘요."
              }
            },
            compare: {
              text: {
                en: "A low ceiling can make a busy, noisy room feel cramped.",
                ko: "낮은 천장은 붐비고 시끄러운 방을 더 비좁게 느끼게 할 수 있어요."
              }
            }
          }
        },
        // shown as a note next to the tables in the 3D room
        callout: {
          text: { en: "Round tables help students work together.", ko: "둥근 테이블은 학생들이 함께 공부하도록 도와줘요." },
          source: "Brooks, 2011"
        }
      }
    },
    {
      id: "comfort",
      type: { en: "Comfort", ko: "편안함" },
      name: "Green Nook",
      tagline: {
        en: "A soft, green corner to rest and reset.",
        ko: "쉬면서 다시 힘을 채우는 부드러운 초록 공간이에요."
      },
      sound: "nature",
      soundLabel: { en: "Wind and birds", ko: "바람과 새소리" },
      elements: [
        {
          key: KEY.lighting,
          value: { en: "Natural daylight with green views", ko: "초록 풍경이 보이는 자연광" },
          reason: {
            en: "Looking at greenery for just 40 seconds helped university students stay focused.",
            ko: "초록 식물을 40초만 바라봐도 대학생들이 집중력을 유지하는 데 도움이 됐어요."
          },
          cites: [STUDY.lee]
        },
        {
          key: KEY.noise,
          value: { en: "Soft nature sounds", ko: "잔잔한 자연의 소리" },
          reason: {
            en: "Nature helps tired attention recover.",
            ko: "자연은 지친 주의력이 회복되도록 도와줘요."
          },
          cites: [STUDY.kaplan, STUDY.berman]
        },
        {
          key: KEY.seating,
          value: { en: "Sofas and beanbags", ko: "소파와 빈백" },
          reason: {
            en: "TODO: add our survey result about what makes students feel comfortable.",
            ko: "TODO: 학생들이 무엇에서 편안함을 느끼는지에 대한 우리 설문 결과를 넣을 예정이에요."
          },
          cites: []
        }
      ],
      view3d: {
        ceiling: { ours: 3.0, compare: 2.4 },
        light: {
          ours: { preset: "daylightGreen", name: { en: "natural daylight", ko: "자연광" } },
          compare: { preset: "coldWhite", name: { en: "cold white", ko: "차가운 흰빛" } }
        },
        notes: {
          light: {
            ours: {
              text: {
                en: "Looking at greenery for just 40 seconds helped university students stay focused.",
                ko: "초록 식물을 40초만 바라봐도 대학생들이 집중력을 유지하는 데 도움이 됐어요."
              },
              source: "Lee et al., 2015"
            },
            compare: {
              text: {
                en: "Cold, artificial light doesn't give your tired attention a real break.",
                ko: "차갑고 인공적인 빛은 지친 주의력에 제대로 된 휴식을 주지 못해요."
              }
            }
          },
          ceiling: {
            ours: {
              text: {
                en: "A higher ceiling and big window make the room feel open and restful.",
                ko: "더 높은 천장과 큰 창은 방을 탁 트이고 편안하게 느끼게 해요."
              },
              source: "Kaplan, 1995"
            },
            compare: {
              text: {
                en: "A low ceiling makes a small rest area feel closed in.",
                ko: "낮은 천장은 작은 휴식 공간을 답답하게 만들어요."
              }
            }
          }
        }
      }
    }
  ];

  window.KEY_FACT = {
    text: {
      en: "Classroom features such as light, temperature, and layout explained about 16% of the differences in students' learning progress.",
      ko: "빛, 온도, 배치 같은 교실 특징이 학생들 사이 학습 향상 차이의 약 16%를 설명했어요."
    },
    cite: STUDY.barrett
  };

  // =============================================================
  // Chatbot (chat.js) — "Which of the four spaces our team designed fits me now?"
  // It shows our designs; it does NOT point to real Ajou rooms.
  // English: use "fits", not "recommend".
  // =============================================================

  // question 2: each mood belongs to one of our four designs
  window.MOODS = [
    { id: "focused", label: { en: "Focused", ko: "집중" }, space: "memorization" },
    { id: "stuck", label: { en: "Stuck", ko: "막막함" }, space: "idea" },
    { id: "energetic", label: { en: "Energetic", ko: "활기참" }, space: "teamwork" },
    { id: "tired", label: { en: "Tired", ko: "피곤함" }, space: "comfort" }
  ];

  // result sentences. Rules (chat.js → Chat.decide):
  //   A. mood space = study space   → that space only: main + match
  //   B. mood = tired (study ≠ comfort) → main Green Nook, extra = study space: tiredFirst
  //   C. otherwise                  → main = study space, extra = mood space: main + moodTip
  // Full sentences on purpose, so Korean particles are always right.
  // {space} = the extra space's name (English in both languages).
  window.CHAT = {
    main: {
      memorization: {
        en: "For memorizing, our Focus Room design fits best: bright light, a quiet room, and single desks.",
        ko: "암기에는 우리가 디자인한 Focus Room이 가장 잘 맞아요. 밝은 빛, 조용한 방, 1인 책상이 있어요."
      },
      idea: {
        en: "For new ideas, our Idea Lounge design fits best: dim warm light, café buzz, and a high ceiling.",
        ko: "새로운 아이디어에는 우리가 디자인한 Idea Lounge가 가장 잘 맞아요. 어둑하고 따뜻한 빛, 카페 같은 소리, 높은 천장이 있어요."
      },
      teamwork: {
        en: "For team projects, our Team Studio design fits best: round tables and room to talk.",
        ko: "팀플에는 우리가 디자인한 Team Studio가 가장 잘 맞아요. 둥근 테이블이 있고, 편하게 대화할 수 있어요."
      },
      comfort: {
        en: "To study comfortably, our Green Nook design fits best: daylight, green views, and soft seats.",
        ko: "편안하게 공부하고 싶다면 우리가 디자인한 Green Nook이 가장 잘 맞아요. 자연광, 초록 풍경, 푹신한 자리가 있어요."
      }
    },
    match: {
      en: "Your mood fits this space too. Perfect timing!",
      ko: "지금 기분과도 딱 맞아요. 타이밍이 완벽해요!"
    },
    tiredFirst: {
      en: "You're tired, so rest comes first. Take a short break in the Green Nook. Even 40 seconds of looking at greenery helped students stay focused (Lee et al., 2015). Then study in the {space}.",
      ko: "피곤하다면 쉬는 게 먼저예요. Green Nook에서 잠깐 쉬어 가세요. 초록 풍경을 40초만 봐도 집중에 도움이 됐다는 연구가 있어요 (Lee et al., 2015). 그다음 {space}에서 공부해요."
    },
    // tired has no tip: rule B handles it (comfort + tired is rule A)
    moodTip: {
      focused: {
        en: "You're in a focused mood. When you need to lock in, the Focus Room is there too.",
        ko: "지금 집중이 잘 되는 상태네요. 몰입이 필요할 때는 Focus Room도 있어요."
      },
      stuck: {
        en: "Feeling stuck? Take a lap in the Idea Lounge first. Walking can spark new ideas (Oppezzo & Schwartz, 2014).",
        ko: "막막하다면 먼저 Idea Lounge에서 한 바퀴 걸어 보세요. 걸으면 새 아이디어가 잘 떠올라요 (Oppezzo & Schwartz, 2014)."
      },
      energetic: {
        en: "Full of energy? If you want to talk things through with friends, try the Team Studio.",
        ko: "에너지가 넘친다면, 친구들과 이야기 나누며 공부할 수 있는 Team Studio도 좋아요."
      }
    }
  };
})();
