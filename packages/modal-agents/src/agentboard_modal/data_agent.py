"""DataAgent — uses Claude to generate data pipeline code.

Given a widget spec and a description of what data to fetch,
Claude generates a Python function body that:
1. Calls external APIs, scrapes data, or computes values
2. Returns a list[dict] matching the widget's expected schema

The generated code is validated by security.py before execution.
"""

from __future__ import annotations

import json

import anthropic
import modal
from .app import app, image
from .security import validate_pipeline_code


SYSTEM_PROMPT = """You are a data pipeline code generator for Agentboard.

Generate a Python function body for `fetch(params)` that:
1. Fetches or computes data from the described source
2. Returns a list of dicts with the specified columns

Rules:
- You are writing the BODY of a function `def fetch(params):`
- Use only standard library + requests for HTTP calls
- Return a list of dicts, e.g. [{"date": "2024-01", "value": 42}, ...]
- Access parameters via params dict, e.g. params["repo"]
- Handle errors gracefully — return empty list on failure
- Do NOT use subprocess, os.system, eval, exec, or file writes
- Do NOT import pickle, ctypes, importlib, or shelve

Output ONLY the function body code. No markdown, no explanation."""


@app.cls(
    image=image,
    secrets=[modal.Secret.from_name("anthropic")],
)
class DataAgent:
    """Generates data pipeline code using Claude."""

    @modal.enter()
    def setup(self):
        self.client = anthropic.Anthropic()

    @modal.method()
    def generate_pipeline(
        self,
        description: str,
        columns: list[str],
        params_schema: dict | None = None,
    ) -> dict:
        """Generate pipeline code for a data source.

        Returns:
            {"code": "...", "violations": [...]} — violations empty if safe
        """
        prompt = f"""Generate a fetch(params) function body for this data source:

Description: {description}
Expected output columns: {json.dumps(columns)}
Available params: {json.dumps(params_schema or {})}

Return ONLY the Python function body."""

        response = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )

        code = response.content[0].text.strip()

        # Strip markdown code fences if present
        if code.startswith("```"):
            lines = code.split("\n")
            code = "\n".join(lines[1:-1])

        violations = validate_pipeline_code(code)

        return {
            "code": code,
            "violations": violations,
        }

    @modal.method()
    def validate(self, code: str) -> dict:
        """Validate pipeline code without executing it."""
        violations = validate_pipeline_code(code)
        return {
            "valid": len(violations) == 0,
            "violations": violations,
        }
