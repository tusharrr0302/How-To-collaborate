import { test } from "node:test";
import assert from "node:assert/strict";
import { validateTaskTitle } from "../js/tasks.js";

test("empty and whitespace-only titles are rejected", () => {
  assert.equal(validateTaskTitle("").isValid, false);
  assert.equal(validateTaskTitle("   ").isValid, false);
  assert.equal(validateTaskTitle("\t\n ").isValid, false);
});

test("valid titles are trimmed", () => {
  const result = validateTaskTitle("  Buy milk  ");
  assert.equal(result.isValid, true);
  assert.equal(result.value, "Buy milk");
});

test("overlong titles are rejected", () => {
  assert.equal(validateTaskTitle("x".repeat(151)).isValid, false);
});
