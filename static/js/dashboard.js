// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard scripts loaded');

    function renderPlotlyChart(containerId, chartData, noDataMessage) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Chart container #${containerId} not found.`);
            return;
        }

        if (chartData && chartData.data && chartData.layout && chartData.data.some(trace => trace.values && trace.values.length > 0)) {
            try {
                Plotly.newPlot(containerId, chartData.data, chartData.layout, {
                    responsive: true,
                    displayModeBar: false
                });
                console.log(`✅ Chart #${containerId} rendered successfully.`);
            } catch (e) {
                console.error(`❌ Error rendering chart #${containerId}:`, e);
                container.innerHTML = `<div class="alert alert-danger">Error rendering chart: ${e.message}</div>`;
            }
        } else {
            console.log(`ℹ️ No valid data for chart #${containerId}.`);
            // Fallback UI is already in the HTML, so we don't need to add it here.
        }
    }

    renderPlotlyChart('monthlyRevenueChart', window.monthlyRevenueChartData, 'Không có dữ liệu doanh thu hàng tháng.');
    renderPlotlyChart('collectorChart', window.collectorChartData, 'Không có dữ liệu doanh thu theo người thu tiền.');
    
    console.log('✅ Dashboard script initialization completed');
});
