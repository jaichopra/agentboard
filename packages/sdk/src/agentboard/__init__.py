"""Agentboard Python SDK — create AI-powered dashboards programmatically."""

from .client import AgentboardClient
from .dashboard import Dashboard
from .widget import Widget
from .pipeline import DataPipeline

__all__ = ["AgentboardClient", "Dashboard", "Widget", "DataPipeline"]
