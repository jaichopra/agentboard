"""Security module for validating pipeline code before execution.

Uses AST analysis to reject dangerous patterns. No eval() anywhere.
"""

from __future__ import annotations

import ast


BLOCKED_IMPORTS = {
    "subprocess",
    "shutil",
    "ctypes",
    "importlib",
    "pickle",
    "shelve",
    "code",
    "codeop",
    "compile",
    "compileall",
}

BLOCKED_FUNCTIONS = {
    "eval",
    "exec",
    "compile",
    "__import__",
    "globals",
    "locals",
    "getattr",
    "setattr",
    "delattr",
}

BLOCKED_OS_CALLS = {
    "system",
    "popen",
    "exec",
    "execvp",
    "execvpe",
    "fork",
    "kill",
    "remove",
    "rmdir",
    "unlink",
}


class SecurityViolation(Exception):
    """Raised when pipeline code contains dangerous patterns."""


def validate_pipeline_code(code: str) -> list[str]:
    """Validate pipeline code and return a list of violations (empty = safe)."""
    violations: list[str] = []

    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return [f"Syntax error: {e}"]

    for node in ast.walk(tree):
        # Check imports
        if isinstance(node, ast.Import):
            for alias in node.names:
                module = alias.name.split(".")[0]
                if module in BLOCKED_IMPORTS:
                    violations.append(f"Blocked import: {alias.name}")

        elif isinstance(node, ast.ImportFrom):
            if node.module:
                module = node.module.split(".")[0]
                if module in BLOCKED_IMPORTS:
                    violations.append(f"Blocked import: {node.module}")

        # Check function calls
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id in BLOCKED_FUNCTIONS:
                    violations.append(f"Blocked function: {node.func.id}")

            elif isinstance(node.func, ast.Attribute):
                if node.func.attr in BLOCKED_FUNCTIONS:
                    violations.append(f"Blocked function call: .{node.func.attr}()")

                # Check os.system, os.popen, etc.
                if (
                    isinstance(node.func.value, ast.Name)
                    and node.func.value.id == "os"
                    and node.func.attr in BLOCKED_OS_CALLS
                ):
                    violations.append(f"Blocked os call: os.{node.func.attr}")

        # Block open() in write mode
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id == "open":
                for kw in node.keywords:
                    if kw.arg == "mode" and isinstance(kw.value, ast.Constant):
                        if "w" in str(kw.value.value) or "a" in str(kw.value.value):
                            violations.append("Blocked: file write via open()")

    return violations


def check_pipeline_code(code: str) -> None:
    """Validate code and raise SecurityViolation if dangerous."""
    violations = validate_pipeline_code(code)
    if violations:
        raise SecurityViolation(
            f"Pipeline code rejected: {'; '.join(violations)}"
        )
