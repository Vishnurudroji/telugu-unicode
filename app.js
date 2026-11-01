
import { t as engine } from "./telugu-engine.js";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const mode = $("mode");
  const source = $("source");
  const output = $("output");

  const sourceLabel = $("sourceLabel");
  const outputLabel = $("outputLabel");
  const loadStatus = $("loadStatus");
  const message = $("message");

  const sourceCount = $("sourceCount");
  const outputCount = $("outputCount");
  const matchInfo = $("matchInfo");

  const convertBtn = $("convertBtn");
  const swapBtn = $("swapBtn");
  const clearBtn = $("clearBtn");
  const copyBtn = $("copyBtn");
  const pasteHint = $("pasteHint");

  const OPTIONS = {
    version: "anu7",
    raAfter: false
  };

  const normalize = (text) => String(text).normalize("NFC");

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = value;
  }

  function setWidth(id, percentage) {
    const element = $(id);
    if (element) {
      element.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    }
  }

  function updateCounts() {
    setText("sourceCount", `${[...source.value].length} characters`);
    setText("outputCount", `${[...output.value].length} characters`);
  }

  function updateLabels() {
    const forward = mode.value === "unicodeToAnu";

    sourceLabel.textContent = forward
      ? "Telugu Unicode text"
      : "ANU 7 legacy text";

    outputLabel.textContent = forward
      ? "ANU 7 legacy output"
      : "Telugu Unicode output";

    source.placeholder = forward
      ? "Paste or type Telugu Unicode text here…"
      : "Paste or type ANU 7 legacy text here…";

    matchInfo.textContent = forward
      ? "Unicode → ANU 7"
      : "ANU 7 → Unicode";
  }

  function convertText() {
    const input = source.value;

    if (!input) {
      output.value = "";
      updateCounts();
      setText("processingTime", "—");
      message.textContent = "Enter some text to convert.";
      return;
    }

    const start = performance.now();

    try {
      const result = mode.value === "anuToUnicode"
        ? engine.fromAnu(input, OPTIONS)
        : engine.toAnu(input, {
            ...OPTIONS,
            cleanSpaces: false
          });

      output.value = result;

      const elapsed = performance.now() - start;

      setText("processingTime", `${elapsed.toFixed(3)} ms`);
      setText("processingDetail", "Actual conversion execution time");

      updateCounts();

      message.textContent = "Conversion completed successfully.";
      message.className = "message success";

    } catch (error) {
      console.error("Conversion error:", error);

      output.value = "";
      updateCounts();

      message.textContent = "Conversion failed. Check the input and try again.";
      message.className = "message error";
    }
  }

  function swapMode() {
    const oldSource = source.value;
    const oldOutput = output.value;

    mode.value = mode.value === "anuToUnicode"
      ? "unicodeToAnu"
      : "anuToUnicode";

    source.value = oldOutput;
    output.value = oldSource;

    updateLabels();
    updateCounts();

    message.textContent = "Conversion direction swapped.";
    message.className = "message";
  }

  function clearAll() {
    source.value = "";
    output.value = "";

    updateCounts();
    source.focus();

    message.textContent = "Text cleared.";
    message.className = "message";
  }

  async function copyOutput() {
    if (!output.value) {
      message.textContent = "There is no output to copy.";
      return;
    }

    try {
      await navigator.clipboard.writeText(output.value);
      message.textContent = "Output copied to clipboard.";
    } catch {
      output.focus();
      output.select();

      const copied = document.execCommand("copy");

      message.textContent = copied
        ? "Output copied to clipboard."
        : "Select the output and press Ctrl+C.";
    }
  }

  function showPasteHint() {
    source.focus();
    message.textContent = "Press Ctrl+V to paste your text.";
  }

  // ----------------------------------
  // MAPPING INVENTORY
  // ----------------------------------

  function loadMappingInformation() {
    const anu7 = engine.tables.anu7;

    const groups = [
      anu7.base,
      anu7.vattu,
      anu7.gunintam,
      anu7.halant,
      anu7.ksha,
      anu7.lig
    ];

    const mappingCount = groups.reduce((total, group) => {
      return total + Object.keys(group || {}).filter(
        key => group[key] !== "" && group[key] != null
      ).length;
    }, 0);

    // These are mapping entries, NOT CSV row counts.
    setText("mappedRows", mappingCount);
    setText("mappingMappedRows", mappingCount);
    setText("totalRows", "—");
    setText("missingRows", "—");

    setText("mappingTotalRows", "—");
    setText("mappingMissingRows", "—");

    setText("coverageScore", mappingCount);
    setText("coverageDetail", "Loaded ANU7 mapping entries");
    setWidth("coverageBar", 0);

    console.log("ANU7 mapping entries:", mappingCount);
    console.log("ANU7 mapping groups:", anu7);
  }

  // ----------------------------------
  // TEST DATA
  // ----------------------------------

  // Expected outputs are based on verified ANU7 examples.
  const testCases = [
    { name: "Basic consonant - వ", unicode: "వ", anu: "e" },
    { name: "Vowel combination - వి", unicode: "వి", anu: "$" },
    { name: "Vowel combination - వీ", unicode: "వీ", anu: "M" },
    { name: "Consonant - ద", unicode: "ద", anu: "<Š" },
    { name: "Vowel combination - ది", unicode: "ది", anu: "~" },
    { name: "Vowel combination - దీ", unicode: "దీ", anu: "B" },
    { name: "Consonant - య", unicode: "య", anu: "jáT" },
    { name: "Vowel combination - యా", unicode: "యా", anu: "jáÖ" },
    { name: "Halant - ర్", unicode: "ర్", anu: "sY" },
    { name: "Consonant - ర", unicode: "ర", anu: "sÁ" },
    { name: "Consonant - థ", unicode: "థ", anu: "<¸Š" },
    { name: "Vowel combination - థి", unicode: "థి", anu: "~¸" },
    { name: "Conjunct - క్ష", unicode: "క్ష", anu: "¿£Œ" },
    { name: "Consonant - గ", unicode: "గ", anu: ">·" },
    { name: "Vowel combination - గు", unicode: "గు", anu: ">·T" },
    { name: "Conjunct - ద్", unicode: "ద్", anu: "<Ž" }
  ];

  // ----------------------------------
  // TEST RUNNER
  // ----------------------------------

  function addTestResult(name, passed, details) {
    const list = $("testList");
    if (!list) return;

    const row = document.createElement("div");
    row.className = "test-result";

    const nameElement = document.createElement("span");
    nameElement.textContent = name;

    const detailElement = document.createElement("span");
    detailElement.textContent = details || "";

    const status = document.createElement("span");
    status.className = passed ? "test-pass" : "test-fail";
    status.textContent = passed ? "PASS" : "FAIL";

    row.append(nameElement, detailElement, status);
    list.appendChild(row);
  }

  function runTests() {
    const list = $("testList");

    if (list) list.replaceChildren();

    let passed = 0;
    let failed = 0;

    const results = [];

    // Test forward and reverse conversion.
    for (const test of testCases) {
      let forwardPassed = false;
      let reversePassed = false;

      try {
        const actualAnu = engine.toAnu(test.unicode, {
          ...OPTIONS,
          cleanSpaces: false
        });

        forwardPassed = actualAnu === test.anu;

        const actualUnicode = engine.fromAnu(test.anu, OPTIONS);

        reversePassed =
          normalize(actualUnicode) === normalize(test.unicode);

      } catch (error) {
        console.error(`Test error: ${test.name}`, error);
      }

      results.push({
        name: `${test.name} — Unicode → ANU7`,
        passed: forwardPassed
      });

      results.push({
        name: `${test.name} — ANU7 → Unicode`,
        passed: reversePassed
      });
    }

    for (const result of results) {
      if (result.passed) passed++;
      else failed++;

      addTestResult(
        result.name,
        result.passed,
        result.passed ? "Expected output matched" : "Output mismatch"
      );
    }

    const total = passed + failed;
    const score = total ? (passed / total) * 100 : 0;

    setText("passedTests", passed);
    setText("failedTests", failed);
    setText("totalTests", total);

    setText("testScore", `${score.toFixed(1)}%`);
    setText("testDetail", `${passed} of ${total} tests passed`);
    setWidth("testBar", score);

    setText("testStatus", failed === 0 ? "All tests passed" : "Issues detected");

    // Round-trip test: Unicode -> ANU -> Unicode.
    let roundTripPassed = 0;

    for (const test of testCases) {
      try {
        const anu = engine.toAnu(test.unicode, {
          ...OPTIONS,
          cleanSpaces: false
        });

        const unicode = engine.fromAnu(anu, OPTIONS);

        if (normalize(unicode) === normalize(test.unicode)) {
          roundTripPassed++;
        }
      } catch (error) {
        console.error("Round-trip error:", error);
      }
    }

    const roundTripScore = testCases.length
      ? (roundTripPassed / testCases.length) * 100
      : 0;

    setText("roundTripScore", `${roundTripScore.toFixed(1)}%`);
    setText(
      "roundTripDetail",
      `${roundTripPassed} of ${testCases.length} cases matched`
    );
    setWidth("roundTripBar", roundTripScore);

    // Explicitly explain the scope of this score.
    setText(
      "testDetail",
      "Pass rate for the built-in verified test cases"
    );

    console.log("Conversion test results:", {
      passed,
      failed,
      total,
      passRate: score,
      roundTripPassed,
      roundTripTotal: testCases.length,
      roundTripScore
    });

    message.textContent =
      `Testing complete: ${passed} passed, ${failed} failed.`;

    message.className = failed === 0
      ? "message success"
      : "message error";
  }

  // ----------------------------------
  // EVENTS
  // ----------------------------------

  // ----------------------------------
// EVENTS
// ----------------------------------

convertBtn?.addEventListener("click", convertText);
swapBtn?.addEventListener("click", swapMode);
clearBtn?.addEventListener("click", clearAll);
copyBtn?.addEventListener("click", copyOutput);
pasteHint?.addEventListener("click", showPasteHint);

mode?.addEventListener("change", () => {
  output.value = "";
  updateLabels();
  updateCounts();

  message.textContent = "Conversion direction changed.";
});

source?.addEventListener("input", updateCounts);

source?.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    convertText();
  }
});

const runTestsBtn = $("runTestsBtn");

runTestsBtn?.addEventListener("click", runTests);
 

  // ----------------------------------
  // INITIALIZE
  // ----------------------------------

  updateLabels();
  updateCounts();
  loadMappingInformation();

  loadStatus.textContent = "ANU7 conversion engine loaded";

  const status = $("engineStatus");
  if (status) status.classList.add("ready");

  setText("processingTime", "—");
  setText("processingDetail", "Waiting for conversion");

  message.textContent = "Ready when you are.";

  console.log("Telugu Vector Studio initialized.");
});
