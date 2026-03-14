"""
Agentboard Multimodal Dashboard Example

Demonstrates all multimodal widget types: images, video, maps,
markdown, code blocks, and point clouds alongside traditional charts.

Usage:
    export AGENTBOARD_API_KEY=ab_...
    python multimodal_dashboard.py
"""

from agentboard import AgentboardClient, Dashboard, Widget, DataPipeline

client = AgentboardClient(api_key="ab_test_key")

# --- Data pipelines ---

sensor_data = DataPipeline.static(data=[
    {"time": "00:00", "temperature": 22.1, "humidity": 45},
    {"time": "04:00", "temperature": 19.8, "humidity": 52},
    {"time": "08:00", "temperature": 21.5, "humidity": 48},
    {"time": "12:00", "temperature": 26.3, "humidity": 38},
    {"time": "16:00", "temperature": 28.7, "humidity": 33},
    {"time": "20:00", "temperature": 24.2, "humidity": 41},
])

point_cloud_data = DataPipeline.static(data=[
    {"x": x * 0.1, "y": y * 0.1, "z": (x * x + y * y) * 0.01}
    for x in range(-10, 11)
    for y in range(-10, 11)
])

# --- Dashboard ---

dashboard = Dashboard(
    title="Field Station Monitor",
    description="Real-time environmental monitoring with multimodal data from remote field stations.",
    tags=["multimodal", "environmental", "iot"],
    widgets=[
        # Row 1: KPIs
        Widget.kpi_card(
            title="Avg Temperature",
            data_pipeline=sensor_data,
            value_expr="avg(temperature)",
            suffix="°C",
            layout={"column": 1, "columnSpan": 3, "row": 1, "rowSpan": 1},
        ),
        Widget.kpi_card(
            title="Avg Humidity",
            data_pipeline=sensor_data,
            value_expr="avg(humidity)",
            suffix="%",
            layout={"column": 4, "columnSpan": 3, "row": 1, "rowSpan": 1},
        ),
        Widget.kpi_card(
            title="Peak Temp",
            data_pipeline=sensor_data,
            value_expr="max(temperature)",
            suffix="°C",
            layout={"column": 7, "columnSpan": 3, "row": 1, "rowSpan": 1},
        ),
        Widget.kpi_card(
            title="Active Stations",
            data_pipeline=DataPipeline.static([{"count": 12}]),
            value_expr="sum(count)",
            layout={"column": 10, "columnSpan": 3, "row": 1, "rowSpan": 1},
        ),

        # Row 2-4: Chart + Map side by side
        Widget.area_chart(
            title="Temperature & Humidity",
            data_pipeline=sensor_data,
            x="time",
            y=["temperature", "humidity"],
            colors=["emerald", "cyan"],
            layout={"column": 1, "columnSpan": 6, "row": 2, "rowSpan": 3},
        ),
        Widget.map(
            title="Station Locations",
            markers=[
                {"lat": 37.7749, "lng": -122.4194, "label": "Station Alpha", "color": "#10b981"},
                {"lat": 37.8716, "lng": -122.2727, "label": "Station Beta", "color": "#06b6d4"},
                {"lat": 37.5585, "lng": -122.2711, "label": "Station Gamma", "color": "#8b5cf6"},
                {"lat": 37.4419, "lng": -122.1430, "label": "Station Delta", "color": "#f59e0b"},
            ],
            latitude=37.65,
            longitude=-122.25,
            zoom=10,
            layout={"column": 7, "columnSpan": 6, "row": 2, "rowSpan": 3},
        ),

        # Row 5-6: Image + Video
        Widget.image(
            title="Latest Satellite Image",
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
            alt="Satellite view of Earth at night",
            object_fit="cover",
            caption="Composite satellite imagery — updated every 6 hours",
            layout={"column": 1, "columnSpan": 6, "row": 5, "rowSpan": 3},
        ),
        Widget.video(
            title="Live Feed — Station Alpha",
            src="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            controls=True,
            muted=True,
            caption="Live camera feed from primary monitoring station",
            layout={"column": 7, "columnSpan": 6, "row": 5, "rowSpan": 3},
        ),

        # Row 8-9: Markdown notes + Code block
        Widget.markdown(
            title="Station Notes",
            content=(
                "## Weekly Summary\n\n"
                "All stations reporting **nominal readings** this week.\n\n"
                "### Alerts\n"
                "- Station Delta: humidity sensor calibration due **March 20**\n"
                "- Station Beta: solar panel efficiency at 87% — cleaning scheduled\n\n"
                "### Data Quality\n"
                "| Station | Uptime | Data Completeness |\n"
                "|---------|--------|------------------|\n"
                "| Alpha   | 99.9%  | 100%             |\n"
                "| Beta    | 99.7%  | 99.8%            |\n"
                "| Gamma   | 100%   | 100%             |\n"
                "| Delta   | 98.2%  | 97.5%            |\n"
            ),
            layout={"column": 1, "columnSpan": 6, "row": 8, "rowSpan": 3},
        ),
        Widget.code_block(
            title="Ingestion Pipeline",
            code=(
                "from agentboard import DataPipeline\n"
                "\n"
                "# Pull sensor readings from IoT gateway\n"
                "pipeline = DataPipeline(\n"
                '    name="sensor-ingestion",\n'
                '    source="mqtt://gateway.field.local:1883",\n'
                '    topic="sensors/+/readings",\n'
                "    transform=lambda batch: [\n"
                "        {\n"
                '            "station": msg["device_id"],\n'
                '            "temperature": msg["temp_c"],\n'
                '            "humidity": msg["rh_pct"],\n'
                '            "timestamp": msg["ts"],\n'
                "        }\n"
                "        for msg in batch\n"
                "    ],\n"
                '    schedule="*/5 * * * *",  # every 5 minutes\n'
                ")\n"
                "\n"
                "pipeline.deploy()"
            ),
            language="python",
            show_line_numbers=True,
            layout={"column": 7, "columnSpan": 6, "row": 8, "rowSpan": 3},
        ),

        # Row 11-13: Image grid + 3D point cloud
        Widget.image_grid(
            title="Station Photos",
            images=[
                {"src": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80", "alt": "Field station morning", "caption": "Alpha — sunrise"},
                {"src": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80", "alt": "Forest canopy", "caption": "Beta — canopy"},
                {"src": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80", "alt": "Sunlit forest", "caption": "Gamma — clearing"},
                {"src": "https://images.unsplash.com/photo-1518173946687-a1e1e5a66e84?w=400&q=80", "alt": "Mountain station", "caption": "Delta — ridge"},
                {"src": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80", "alt": "Valley overview", "caption": "Valley view"},
                {"src": "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&q=80", "alt": "Sunset station", "caption": "Golden hour"},
            ],
            columns=3,
            gap=8,
            layout={"column": 1, "columnSpan": 6, "row": 11, "rowSpan": 3},
        ),
        Widget.point_cloud(
            title="Terrain Elevation Model",
            data_pipeline=point_cloud_data,
            color="#10b981",
            point_size=0.08,
            layout={"column": 7, "columnSpan": 6, "row": 11, "rowSpan": 3},
        ),
    ],
)

result = client.deploy(dashboard, publish=True)
print(f"Dashboard: {result.url}")
