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
    steidle: { label: "Steidle & Werth (2013)", url: "https://doi.org/10.1016/j.jenvp.2013.05.003" },
    mehta: { label: "Mehta, Zhu & Cheema (2012)", url: "https://doi.org/10.1086/665048" },
    meyers: { label: "Meyers-Levy & Zhu (2007)", url: "https://doi.org/10.1086/519146" },
    oppezzo: { label: "Oppezzo & Schwartz (2014)", url: "https://doi.org/10.1037/a0036577" },
    barrett: { label: "Barrett et al. (2015)", url: "https://doi.org/10.1016/j.buildenv.2015.02.013" },
    brooks: { label: "Brooks (2011)", url: "https://doi.org/10.1111/j.1467-8535.2010.01098.x" },
    lee: { label: "Lee et al. (2015)", url: "https://findanexpert.unimelb.edu.au/scholarlywork/977781-40-second-green-roof-views-sustain-attention--the-role-of-micro-breaks-in-attention-restoration" },
    kaplan: { label: "Kaplan (1995)", url: "https://doi.org/10.1016/0272-4944(95)90001-2" },
    berman: { label: "Berman, Jonides & Kaplan (2008)", url: "https://doi.org/10.1111/j.1467-9280.2008.02225.x" },
    // on the research screen only (not used as a source on a design card yet)
    mehtaColor: { label: "Mehta & Zhu (2009)", url: "https://doi.org/10.1126/science.1169144" },
    atchley: { label: "Atchley, Strayer & Atchley (2012)", url: "https://doi.org/10.1371/journal.pone.0051474" }
  };

  // ---------- research screen: one card per study ----------
  // journal + label are never translated. about = 4–5 sentences in en and ko.
  // Use only sentences the team wrote — don't add new claims.
  STUDY.barrett.journal = "Building and Environment";
  STUDY.barrett.about = {
    en: [
      "The researchers studied 153 classrooms in 27 primary schools in the UK, with about 3,700 pupils, over one school year.",
      "They measured classroom features such as light, temperature, air quality, layout, and color.",
      "Then they compared these features with how much each pupil's reading, writing, and math improved during the year.",
      "Classroom features explained about 16% of the differences in pupils' progress, and light was one of the important factors.",
      "The study was done with primary school pupils, so we use it as general evidence that space matters, not as a rule for university students."
    ],
    ko: [
      "연구진은 영국 초등학교 27곳의 교실 153개에서 학생 약 3,700명을 1년 동안 조사했어요.",
      "빛, 온도, 공기 질, 배치, 색 같은 교실의 특징을 측정했어요.",
      "그리고 이 특징들을 한 해 동안 학생들의 읽기, 쓰기, 수학 실력이 얼마나 늘었는지와 비교했어요.",
      "교실의 특징이 학생들의 성장 차이의 약 16%를 설명했고, 빛이 중요한 요소 중 하나였어요.",
      "초등학생을 대상으로 한 연구라서, 대학생에게 그대로 적용하기보다는 공간이 중요하다는 전반적인 근거로 활용했어요."
    ]
  };
  STUDY.meyers.journal = "Journal of Consumer Research";
  STUDY.meyers.about = {
    en: [
      "This study asked whether the height of a ceiling changes the way people think.",
      "Participants did tasks in rooms with a ceiling of about 3 m or about 2.4 m.",
      "In the high-ceiling room, people thought more about \"freedom\" and connected ideas more broadly and abstractly.",
      "In the low-ceiling room, people thought more about \"confinement\" and focused more on details, one by one.",
      "The effect was stronger when people noticed the ceiling, which is why we make ceiling height easy to see in our designs."
    ],
    ko: [
      "이 연구는 천장 높이가 사람의 생각하는 방식을 바꾸는지 알아봤어요.",
      "참가자들은 천장 높이가 약 3m인 방과 약 2.4m인 방에서 과제를 했어요.",
      "천장이 높은 방에서는 '자유'를 더 떠올렸고, 생각을 넓고 추상적으로 연결했어요.",
      "천장이 낮은 방에서는 '갇힘'을 더 떠올렸고, 세부 내용에 하나하나 집중했어요.",
      "천장을 의식할 때 효과가 더 컸기 때문에, 우리 디자인에서는 천장 높이가 눈에 잘 띄도록 했어요."
    ]
  };
  STUDY.mehta.journal = "Journal of Consumer Research";
  STUDY.mehta.about = {
    en: [
      "This study tested how background noise affects creative thinking.",
      "Participants worked on creative tasks with noise at about 50 dB (quiet), 70 dB (like a busy café), or 85 dB (very loud).",
      "People did best on creative tasks with the moderate 70 dB noise, better than in the quiet room.",
      "The researchers explained that moderate noise makes thinking slightly harder, which pushes people to think more broadly.",
      "Very loud noise at 85 dB made performance worse, so loud places are not good for any kind of study."
    ],
    ko: [
      "이 연구는 주변 소음이 창의적인 생각에 어떤 영향을 주는지 실험했어요.",
      "참가자들은 약 50dB(조용함), 70dB(붐비는 카페 정도), 85dB(아주 시끄러움)의 소음 속에서 창의 과제를 했어요.",
      "적당한 70dB 소음에서 창의 과제를 가장 잘했고, 조용한 방보다도 결과가 좋았어요.",
      "연구진은 적당한 소음이 생각을 조금 어렵게 만들어서, 오히려 더 넓게 생각하게 한다고 설명했어요.",
      "85dB의 아주 큰 소음에서는 결과가 나빠져서, 시끄러운 곳은 어떤 공부에도 좋지 않아요."
    ]
  };
  STUDY.steidle.journal = "Journal of Environmental Psychology";
  STUDY.steidle.about = {
    en: [
      "This study tested whether lighting changes how creative people are.",
      "In several experiments, participants solved creative tasks in dim light or in bright light.",
      "People in dim light came up with more creative solutions.",
      "The researchers found that darkness made people feel freer and less held back, which helped creativity.",
      "They also suggested that bright light may be better for careful checking and analysis, which is why our Focus Room uses bright light."
    ],
    ko: [
      "이 연구는 조명이 사람의 창의성을 바꾸는지 실험했어요.",
      "여러 실험에서 참가자들은 어둑한 조명이나 밝은 조명 아래에서 창의 과제를 풀었어요.",
      "어둑한 조명 아래에 있던 사람들이 더 창의적인 해결책을 냈어요.",
      "연구진은 어둠이 사람을 더 자유롭고 덜 위축되게 느끼게 해서 창의성에 도움이 됐다고 봤어요.",
      "꼼꼼한 검토나 분석에는 밝은 조명이 더 나을 수 있다고도 제안했는데, 그래서 Focus Room에는 밝은 조명을 썼어요."
    ]
  };
  STUDY.oppezzo.journal = "Journal of Experimental Psychology: Learning, Memory, and Cognition";
  STUDY.oppezzo.about = {
    en: [
      "This study from Stanford University compared walking and sitting in four experiments, mostly with college students.",
      "Participants thought of new uses for everyday objects while walking or while sitting.",
      "Walking increased the number of creative ideas by about 60% on average.",
      "The effect stayed for a while even after people sat down again.",
      "Walking did not help with problems that have only one right answer, so we put a walking loop in the Idea Lounge, not in the Focus Room."
    ],
    ko: [
      "스탠퍼드대의 이 연구는 주로 대학생을 대상으로 네 번의 실험에서 걷기와 앉아 있기를 비교했어요.",
      "참가자들은 걸으면서, 또는 앉아서 일상 물건의 새로운 쓰임새를 떠올렸어요.",
      "걸을 때 창의적인 아이디어의 수가 평균 약 60% 늘었어요.",
      "이 효과는 다시 앉은 뒤에도 한동안 남아 있었어요.",
      "정답이 하나인 문제에는 걷기가 도움이 되지 않아서, 걷는 동선은 Focus Room이 아니라 Idea Lounge에 넣었어요."
    ]
  };
  // The next studies use 4-sentence summaries of the team's week-10 literature notes.
  STUDY.brooks.journal = "British Journal of Educational Technology";
  STUDY.brooks.about = {
    en: [
      "This study took place at the University of Minnesota in the United States.",
      "The same professor taught the same course in two rooms: a traditional classroom and an active learning classroom with round tables and shared screens.",
      "Students in the active learning classroom got better grades than their entrance scores predicted.",
      "It was done with university students, so it fits our topic well, and we use it for the round tables and movable furniture in the Team Studio."
    ],
    ko: [
      "이 연구는 미국 미네소타대에서 진행됐어요.",
      "같은 교수가 같은 수업을 일반 강의실과, 둥근 테이블과 공유 화면이 있는 협업형 강의실에서 진행했어요.",
      "협업형 강의실의 학생들이 입학 성적으로 예상한 것보다 더 좋은 성적을 받았어요.",
      "대학생을 대상으로 한 연구라 우리 주제와 잘 맞아서, Team Studio의 둥근 테이블과 이동식 가구의 근거로 썼어요."
    ]
  };
  STUDY.kaplan.journal = "Journal of Environmental Psychology";
  STUDY.kaplan.about = {
    en: [
      "This paper proposed Attention Restoration Theory.",
      "When people focus for a long time, their attention gets tired.",
      "The theory says nature draws our attention without any effort, and this lets tired attention recover.",
      "We use it as the theory behind why a rest space is needed, like our Green Nook."
    ],
    ko: [
      "이 논문은 '주의 회복 이론'을 제안했어요.",
      "오래 집중하면 주의력이 지쳐요.",
      "자연은 힘들이지 않고 마음을 끌어서, 지친 주의력을 회복시켜 준다는 이론이에요.",
      "Green Nook 같은 휴식 공간이 왜 필요한지 설명하는 이론적 바탕으로 썼어요."
    ]
  };
  STUDY.berman.journal = "Psychological Science";
  STUDY.berman.about = {
    en: [
      "Participants walked in an arboretum (nature) or in a city center, and then their attention was compared.",
      "After walking in nature, their attention scores were higher.",
      "Even just looking at photos of nature had an effect.",
      "We use it for the natural elements of the Green Nook, such as plants and nature pictures."
    ],
    ko: [
      "참가자들에게 수목원(자연)이나 도심을 걷게 한 뒤 주의력을 비교했어요.",
      "자연을 걸은 뒤에 주의력 점수가 더 높았어요.",
      "자연 사진을 보기만 해도 효과가 있었어요.",
      "Green Nook의 식물, 자연 사진 같은 자연 요소의 근거로 썼어요."
    ]
  };
  STUDY.lee.journal = "Journal of Environmental Psychology";
  STUDY.lee.about = {
    en: [
      "In this study, 150 university students looked at a photo of a green roof or a concrete roof for 40 seconds in the middle of a task.",
      "Students who saw the green roof made fewer mistakes in the task afterwards.",
      "It shows that even a short break can help.",
      "It was done with university students, which makes it easy for us to use, and it supports the green views in the Green Nook."
    ],
    ko: [
      "대학생 150명에게 과제 중간에 40초 동안 초록 옥상 또는 콘크리트 옥상 사진을 보게 했어요.",
      "초록 옥상을 본 학생들이 이후 과제에서 실수가 더 적었어요.",
      "짧은 휴식도 효과가 있다는 걸 보여 준 연구예요.",
      "대학생 대상이라 활용하기 좋아서, Green Nook의 초록 풍경의 근거로 썼어요."
    ]
  };
  STUDY.mehtaColor.journal = "Science";
  STUDY.mehtaColor.about = {
    en: [
      "This study tested whether a red or a blue background changes how well people do tasks.",
      "With red, people did better on detail tasks such as remembering and proofreading.",
      "With blue, people did better on creative tasks.",
      "We use it when choosing colors for each space, but later studies had mixed results, so we only call it a tendency."
    ],
    ko: [
      "빨간색과 파란색 배경에서 과제 수행이 달라지는지 실험했어요.",
      "빨간색에서는 기억하기, 교정 보기 같은 세부 과제를 더 잘했어요.",
      "파란색에서는 창의 과제를 더 잘했어요.",
      "공간별 색을 고를 때 참고하지만, 후속 연구에서 결과가 엇갈려서 '~한 경향이 있다' 정도로만 표현해요."
    ]
  };
  STUDY.atchley.journal = "PLoS ONE";
  STUDY.atchley.about = {
    en: [
      "This study compared the creative task scores of people who spent four days in nature without digital devices.",
      "After their time in nature, their scores were about 50% higher.",
      "However, we can't tell whether the effect came from nature or from not using devices.",
      "We use it as a reason to design rest spaces where people put their devices down."
    ],
    ko: [
      "4일 동안 디지털 기기 없이 자연에서 지낸 사람들의 창의 과제 점수를 비교했어요.",
      "자연에서 지낸 뒤 점수가 약 50% 높아졌어요.",
      "다만 자연의 효과인지, 기기를 쓰지 않은 효과인지는 구분되지 않아요.",
      "휴식 공간에서 디지털 기기를 내려놓도록 공간을 구성하는 근거로 써요."
    ]
  };

  // "Key evidence" badge: studies that show the same space feature works
  // differently for different kinds of study (the core of our idea)
  STUDY.meyers.key = true;
  STUDY.mehta.key = true;
  STUDY.oppezzo.key = true;

  // order and groups on the research screen (same order as the week-10 literature review)
  const GROUP = {
    overall: { en: "Overall evidence", ko: "전체 근거" },
    focus: { en: "Focus", ko: "집중" },
    ideas: { en: "Ideas", ko: "아이디어" },
    together: { en: "Collaboration", ko: "협업" },
    rest: { en: "Rest", ko: "휴식" }
  };
  window.STUDIES = [
    [STUDY.barrett, GROUP.overall],
    [STUDY.meyers, GROUP.focus], [STUDY.mehtaColor, GROUP.focus],
    [STUDY.mehta, GROUP.ideas], [STUDY.steidle, GROUP.ideas], [STUDY.oppezzo, GROUP.ideas],
    [STUDY.brooks, GROUP.together],
    [STUDY.kaplan, GROUP.rest], [STUDY.berman, GROUP.rest], [STUDY.lee, GROUP.rest], [STUDY.atchley, GROUP.rest]
  ].map(([study, group]) => Object.assign(study, { group }));

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
