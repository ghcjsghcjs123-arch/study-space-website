# Count the survey answers in survey/responses.xlsx (needs: pip install openpyxl).
# usage: python3 survey/aggregate.py survey/responses.xlsx counts.json
# The numbers in data.js (SURVEY.sections) must match what this prints.
import sys, json, collections, itertools, openpyxl
wb = openpyxl.load_workbook(sys.argv[1], data_only=True)
rows = list(wb.worksheets[0].iter_rows(values_only=True))
hdr, data = rows[0], rows[1:]
first = data[0]
assert first[1] is None, "expected the test response (no grade) first"
data = data[1:]                      # drop the test response
N = len(data)
out = {"N": N, "excluded_test_response": str(first[0])}

def single(col, merge=None):
    c = collections.Counter()
    for r in data:
        v = r[col]
        v = (merge or {}).get(v, v)
        c[str(v) if v is not None else "(no answer)"] += 1
    return c

out["grade"] = single(1)
q1merge = {"도서관, 스터디카페": "도서관, 스터디카페: 공부에 집중할 수 있는 조용한 공간",
           "카페": "카페: 배경음악이 있는 자유로운 공간",
           "주거공간": "주거공간: 익숙하고 편하지만 생활 소음이 있는 공간"}
out["q1"] = single(2, q1merge)
out["q2"] = {}
for col in range(3, 8):
    place = hdr[col].split("[", 1)[1].rstrip("]")
    out["q2"][place] = single(col)

Q3_OPTS = ["조명의 밝기 여부", "소음 수준", "실내 색상", "식물과 자연요소", "좌석의 편안함", "공간의 개방감", "온도와 공기 청정 정도"]
Q4_OPTS = ["콘센트·USB 충전이 가능한 좌석", "조명 밝기를 조절할 수 있는 좌석", "방음이 된 개인 학습실", "여럿이 토론할 수 있는 그룹 스터디룸",
           "화이트보드 벽이나 메모 공간", "식물이 있는 휴게 공간", "편안한 의자·소파 좌석", "환기와 온도 조절이 잘 되는 공간"]

def multi(col, opts):
    c = collections.Counter({o: 0 for o in opts}); unknown = collections.Counter(); answered = 0; order_pairs = set()
    for r in data:
        v = r[col]
        if not v: continue
        answered += 1
        parts = [p.strip() for p in str(v).split(", ")]
        known = [p for p in parts if p in opts]
        for p in parts:
            if p in opts: c[p] += 1
            else: unknown[p] += 1
        for a, b in itertools.combinations(known, 2): order_pairs.add((a, b))
    # form order check: every pair appears in the order of opts
    bad = [(a, b) for a, b in order_pairs if opts.index(a) > opts.index(b)]
    return {"respondents": answered, "items": c, "unknown": unknown, "order_ok": not bad}

acts = {8: "memorization", 9: "idea", 10: "teamwork", 11: "comfort"}
out["q3"] = {acts[col]: dict(activity=hdr[col].strip(), **multi(col, Q3_OPTS)) for col in range(8, 12)}
out["q4"] = {acts[col - 4]: dict(activity=hdr[col].strip().removesuffix(" 2"), **multi(col, Q4_OPTS)) for col in range(12, 16)}
out["Q3_OPTS"], out["Q4_OPTS"] = Q3_OPTS, Q4_OPTS
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, indent=1, default=dict)

print("N =", N, "| excluded:", out["excluded_test_response"])
print("grade:", dict(out["grade"]))
print("Q1:", dict(out["q1"]), "sum", sum(out["q1"].values()))
for p, c in out["q2"].items(): print("Q2", p[:22], dict(sorted(c.items())), "sum", sum(c.values()))
for q in ("q3", "q4"):
    for sp, d in out[q].items():
        print(q.upper(), sp, "resp", d["respondents"], "sel", sum(d["items"].values()), "order_ok", d["order_ok"], "unknown", dict(d["unknown"]))
        print("    ", dict(d["items"]))
