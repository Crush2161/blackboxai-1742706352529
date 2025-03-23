// Trading chart functionality
class TradingChart {
    constructor() {
        this.chart = null;
        this.data = [];
        this.currentPrice = 44.0000;
        this.initChart();
        this.startPriceUpdates();
    }

    initChart() {
        const canvas = document.getElementById('tradingChart');
        const ctx = canvas.getContext('2d');
        
        // Initialize with some data
        for (let i = 0; i < 50; i++) {
            this.data.push({
                open: this.currentPrice + (Math.random() * 0.02 - 0.01),
                high: this.currentPrice + (Math.random() * 0.03),
                low: this.currentPrice - (Math.random() * 0.03),
                close: this.currentPrice + (Math.random() * 0.02 - 0.01)
            });
        }

        this.drawCandlesticks(ctx);
    }

    drawCandlesticks(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const candleWidth = 8;
        const spacing = 4;
        const scaleY = 1000; // Price scaling factor

        this.data.forEach((candle, i) => {
            const x = i * (candleWidth + spacing);
            const color = candle.close > candle.open ? '#00d67d' : '#ef4444';
            
            // Draw candlestick body
            ctx.fillStyle = color;
            ctx.fillRect(
                x,
                (candle.open - this.currentPrice) * scaleY + ctx.canvas.height / 2,
                candleWidth,
                (candle.close - candle.open) * scaleY
            );

            // Draw wicks
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(x + candleWidth / 2, (candle.high - this.currentPrice) * scaleY + ctx.canvas.height / 2);
            ctx.lineTo(x + candleWidth / 2, (candle.low - this.currentPrice) * scaleY + ctx.canvas.height / 2);
            ctx.stroke();
        });
    }

    startPriceUpdates() {
        setInterval(() => {
            // Update current price
            this.currentPrice += (Math.random() * 0.02 - 0.01);
            
            // Add new candle
            this.data.push({
                open: this.currentPrice,
                high: this.currentPrice + (Math.random() * 0.01),
                low: this.currentPrice - (Math.random() * 0.01),
                close: this.currentPrice + (Math.random() * 0.02 - 0.01)
            });
            
            // Remove oldest candle
            if (this.data.length > 50) {
                this.data.shift();
            }

            // Update price display
            document.getElementById('currentPrice').textContent = this.currentPrice.toFixed(4);
            
            // Redraw chart
            this.drawCandlesticks(document.getElementById('tradingChart').getContext('2d'));
        }, 1000);
    }
}

// Trading functionality
class TradingSystem {
    constructor() {
        this.balance = 10000;
        this.activeTrades = [];
        this.initEventListeners();
        this.updateBalance();
    }

    initEventListeners() {
        document.getElementById('buyButton').addEventListener('click', () => this.placeTrade('buy'));
        document.getElementById('sellButton').addEventListener('click', () => this.placeTrade('sell'));
    }

    placeTrade(direction) {
        const amount = parseFloat(document.getElementById('investmentAmount').value);
        const timeFrame = parseInt(document.getElementById('timeFrame').value);
        
        if (amount > this.balance) {
            alert('Insufficient funds');
            return;
        }

        this.balance -= amount;
        this.updateBalance();

        const trade = {
            direction,
            amount,
            entryPrice: parseFloat(document.getElementById('currentPrice').textContent),
            timeLeft: timeFrame,
            profit: 0
        };

        this.activeTrades.push(trade);
        this.updateTrades();

        // Simulate trade result
        setTimeout(() => {
            const exitPrice = parseFloat(document.getElementById('currentPrice').textContent);
            const priceDiff = exitPrice - trade.entryPrice;
            trade.profit = direction === 'buy' ? priceDiff * amount : -priceDiff * amount;
            
            this.balance += amount + trade.profit;
            this.updateBalance();
            
            this.activeTrades = this.activeTrades.filter(t => t !== trade);
            this.updateTrades();
        }, timeFrame * 1000);
    }

    updateBalance() {
        document.getElementById('accountBalance').textContent = `$${this.balance.toFixed(2)} USD`;
    }

    updateTrades() {
        const container = document.getElementById('activeTradesList');
        container.innerHTML = this.activeTrades.map(trade => `
            <div class="trade-card p-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-bold">EUR/USD</span>
                    <span class="${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}">
                        ${trade.profit >= 0 ? '+' : ''}$${trade.profit.toFixed(2)}
                    </span>
                </div>
                <div class="flex justify-between text-sm text-gray-400">
                    <span class="flex items-center">
                        <i class="fas fa-${trade.direction === 'buy' ? 'arrow-up text-green-500' : 'arrow-down text-red-500'} mr-1"></i>
                        ${trade.direction === 'buy' ? 'Buy' : 'Sell'} @ ${trade.entryPrice.toFixed(4)}
                    </span>
                    <span class="flex items-center">
                        <i class="far fa-clock mr-1"></i>
                        ${trade.timeLeft}s
                    </span>
                </div>
            </div>
        `).join('');
    }
}

// Initialize trading system when page loads
document.addEventListener('DOMContentLoaded', () => {
    const chart = new TradingChart();
    const trading = new TradingSystem();
});