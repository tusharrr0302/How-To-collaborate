import { test } from "node:test";
import assert from "node:assert/strict";
import { createTask, deleteTask, getTaskStats, toggleTaskStatus } from "../js/tasks.js";

test("delete updates stats immediately", () => {
  let tasks = [];
  for (const title of ["a", "b", "c"]) {
    const created = createTask({ title });
    tasks = [created.task, ...tasks];
  }
  tasks = toggleTaskStatus(tasks, tasks[0].id).tasks;
  tasks = toggleTaskStatus(tasks, tasks[1].id).tasks;
  assert.equal(getTaskStats(tasks).completed, 2);

  const done = tasks.find((t) => t.completed);
  const result = deleteTask(tasks, done.id);
  assert.equal(result.success, true);
  const stats = getTaskStats(result.tasks);
  assert.equal(stats.total, 2);
  assert.equal(stats.completed, 1);
  assert.equal(stats.completionPercentage, 50);
});

test("empty filter state is reachable after deleting the last completed task", () => {
  const created = createTask({ title: "only" });
  let tasks = [created.task];
  tasks = toggleTaskStatus(tasks, tasks[0].id).tasks;
  const result = deleteTask(tasks, tasks[0].id);
  const remainingCompleted = result.tasks.filter((t) => t.completed);
  assert.equal(remainingCompleted.length, 0);
  assert.equal(getTaskStats(result.tasks).total, 0);
});
