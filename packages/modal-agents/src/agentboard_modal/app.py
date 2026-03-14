"""Modal App definition for Agentboard."""

import modal

app = modal.App("agentboard")

image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install(
        "anthropic>=0.42.0",
        "lancedb>=0.15.0",
        "pyarrow>=18.0.0",
        "pydantic>=2.10.0",
    )
)
