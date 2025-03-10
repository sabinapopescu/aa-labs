import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    AreaChart
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FibonacciAnalysis = () => {
    // Functions for each Fibonacci calculation method
    
    // 1. Fast Doubling method
    const fibFastDoubling = (n) => {
        if (n === 0) return 0;
        if (n === 1) return 1;
        
        const fib = (n) => {
            if (n === 0) return [0, 1];
            const [a, b] = fib(Math.floor(n / 2));
            const c = a * (2 * b - a);
            const d = a * a + b * b;
            return n % 2 === 0 ? [c, d] : [d, c + d];
        };
        
        return fib(n)[0];
    };
    
    // 2. Iterative method
    const fibIterative = (n) => {
        if (n <= 1) return n;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) {
            const temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    };
    
    // 3. Memoization method
    const fibMemoization = () => {
        const memo = {};
        return function fib(n) {
            if (n in memo) return memo[n];
            if (n <= 1) return n;
            memo[n] = fib(n - 1) + fib(n - 2);
            return memo[n];
        };
    };
    
    // 4. Recursive method
    const fibRecursive = (n) => {
        if (n <= 1) return n;
        return fibRecursive(n - 1) + fibRecursive(n - 2);
    };
    
    // 5. Dynamic Programming method
    const fibDP = (n) => {
        if (n <= 1) return n;
        const dp = new Array(n + 1);
        dp[0] = 0;
        dp[1] = 1;
        for (let i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    };
    
    // 6. Matrix Power method
    const fibMatrix = (n) => {
        if (n <= 1) return n;
        
        const multiply = (a, b) => {
            return [
                a[0] * b[0] + a[1] * b[2],
                a[0] * b[1] + a[1] * b[3],
                a[2] * b[0] + a[3] * b[2],
                a[2] * b[1] + a[3] * b[3]
            ];
        };
        
        const power = (matrix, n) => {
            if (n === 1) return matrix;
            if (n % 2 === 0) {
                const p = power(matrix, n / 2);
                return multiply(p, p);
            } else {
                return multiply(matrix, power(matrix, n - 1));
            }
        };
        
        const result = power([1, 1, 1, 0], n - 1);
        return result[0];
    };
    
    // 7. Binet Formula method
    const fibBinet = (n) => {
        const phi = (1 + Math.sqrt(5)) / 2;
        return Math.round((Math.pow(phi, n) - Math.pow(-phi, -n)) / Math.sqrt(5));
    };

    // Sample data structure from the analysis with all 7 methods
    const data = {
        fastDoubling: Array.from({ length: 45 }, (_, i) => ({
            n: i,
            time: Math.log2(i + 1) * 0.15,
            memoryUsed: 600
        })),
        iterative: Array.from({ length: 45 }, (_, i) => ({
            n: i,
            time: i * 0.05,
            memoryUsed: 500
        })),
        memoization: Array.from({ length: 45 }, (_, i) => ({
            n: i,
            time: i * 0.08,
            memoryUsed: i * 800
        })),
        recursive: Array.from({ length: 35 }, (_, i) => ({
            n: i,
            time: Math.pow(1.6, i) * 0.01,
            memoryUsed: Math.pow(1.5, i) * 100
        })),
        dp: Array.from({ length: 45 }, (_, i) => ({
            n: i,
            time: i * 0.1,
            memoryUsed: i * 1000
        })),
        matrix: Array.from({ length: 45 }, (_, i) => ({
            n: i,
            time: Math.log2(i + 1) * 0.2,
            memoryUsed: 800
        })),
        binet: Array.from({ length: 45 }, (_, i) => ({
            n: i,
            time: 0.05,
            memoryUsed: 400
        }))
    };

    // Prepare data for charts
    const timeData = Array.from({ length: 45 }, (_, i) => ({
        n: i,
        "Fast Doubling": data.fastDoubling[i]?.time,
        "Iterative": data.iterative[i]?.time,
        "Memoization": data.memoization[i]?.time,
        "Recursive": i <= 35 ? data.recursive[i]?.time : null,
        "DP": data.dp[i]?.time,
        "Matrix": data.matrix[i]?.time,
        "Binet": data.binet[i]?.time
    }));

    const memoryData = Array.from({ length: 45 }, (_, i) => ({
        n: i,
        "Fast Doubling": data.fastDoubling[i]?.memoryUsed,
        "Iterative": data.iterative[i]?.memoryUsed,
        "Memoization": data.memoization[i]?.memoryUsed,
        "Recursive": i <= 35 ? data.recursive[i]?.memoryUsed : null,
        "DP": data.dp[i]?.memoryUsed,
        "Matrix": data.matrix[i]?.memoryUsed,
        "Binet": data.binet[i]?.memoryUsed
    }));

    // Colors for different algorithms
    const colorMap = {
        "Fast Doubling": "#1f77b4",
        "Iterative": "#ff7f0e",
        "Memoization": "#2ca02c",
        "Recursive": "#d62728",
        "DP": "#9467bd",
        "Matrix": "#8c564b",
        "Binet": "#e377c2"
    };

    // Custom tooltip to show more detailed information
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded shadow-lg">
                    <p className="font-bold text-gray-700">{`n = ${label}`}</p>
                    {payload.map((entry, index) => (
                        entry.value !== null && (
                            <p key={`item-${index}`} style={{ color: entry.color }}>
                                <span className="font-medium">{entry.name}: </span>
                                <span>{entry.value.toFixed(2)} {entry.dataKey === "time" || payload[0].name.includes("Time") ? 'ms' : 'bytes'}</span>
                            </p>
                        )
                    ))}
                </div>
            );
        }
        return null;
    };

    // Calculate actual Fibonacci numbers for comparison
    const [fibResults, setFibResults] = useState({});
    
    useEffect(() => {
        // Calculate Fibonacci numbers for n=0 to n=20 for all methods
        const results = {};
        const n = 20; // Limit to a reasonable value to avoid long calculations
        
        // Create a memoized function instance
        const memoFib = fibMemoization();
        
        for (let i = 0; i <= n; i++) {
            results[i] = {
                fastDoubling: fibFastDoubling(i),
                iterative: fibIterative(i),
                memoization: memoFib(i),
                recursive: i < 35 ? fibRecursive(i) : 'Too large',
                dp: fibDP(i),
                matrix: fibMatrix(i),
                binet: fibBinet(i)
            };
        }
        setFibResults(results);
    }, []);

    return (
        <Card className="w-full max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t">
                <CardTitle className="text-2xl font-bold">Fibonacci Algorithm Analysis</CardTitle>
                <CardDescription className="text-gray-100">Comparing performance metrics across seven different implementations</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <Tabs defaultValue="time" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="time" className="text-sm font-medium">Execution Time</TabsTrigger>
                        <TabsTrigger value="memory" className="text-sm font-medium">Memory Usage</TabsTrigger>
                        <TabsTrigger value="comparison" className="text-sm font-medium">Results Comparison</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="time">
                        <div className="h-96 bg-white p-4 rounded-lg shadow-inner">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="n" 
                                        label={{ value: 'n-th Fibonacci Term', position: 'bottom', fill: '#666' }} 
                                        tick={{ fill: '#666' }}
                                    />
                                    <YAxis 
                                        label={{ value: 'Time (ms)', angle: -90, position: 'left', fill: '#666' }} 
                                        tick={{ fill: '#666' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <ReferenceLine y={0} stroke="#000" />
                                    
                                    {Object.keys(colorMap).map((key) => (
                                        <Line 
                                            key={key}
                                            type="monotone" 
                                            dataKey={key} 
                                            stroke={colorMap[key]} 
                                            strokeWidth={2} 
                                            dot={{ r: 1 }} 
                                            activeDot={{ r: 5, strokeWidth: 1 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                            <p className="font-medium">Time Complexity Analysis:</p>
                            <p><strong>Fast Doubling:</strong> O(log n) - Uses matrix squaring to speed up computation</p>
                            <p><strong>Iterative:</strong> O(n) - Linear time with constant memory</p>
                            <p><strong>Memoization:</strong> O(n) - Caches results to avoid recalculation</p>
                            <p><strong>Recursive:</strong> O(2^n) - Exponential growth due to redundant computations</p>
                            <p><strong>Dynamic Programming:</strong> O(n) - Bottom-up approach with array storage</p>
                            <p><strong>Matrix Power:</strong> O(log n) - Uses matrix exponentiation</p>
                            <p><strong>Binet Formula:</strong> O(1) - Constant time using the mathematical formula</p>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="memory">
                        <div className="h-96 bg-white p-4 rounded-lg shadow-inner">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={memoryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="n" 
                                        label={{ value: 'n-th Fibonacci Term', position: 'bottom', fill: '#666' }} 
                                        tick={{ fill: '#666' }}
                                    />
                                    <YAxis 
                                        label={{ value: 'Memory (bytes)', angle: -90, position: 'left', fill: '#666' }} 
                                        tick={{ fill: '#666' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <ReferenceLine y={0} stroke="#000" />
                                    
                                    {Object.keys(colorMap).map((key) => (
                                        <Area 
                                            key={key}
                                            type="monotone" 
                                            dataKey={key} 
                                            stroke={colorMap[key]} 
                                            fillOpacity={0.3} 
                                            fill={colorMap[key]} 
                                            dot={{ r: 1 }} 
                                            activeDot={{ r: 5 }}
                                        />
                                    ))}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-sm text-gray-600 bg-green-50 p-3 rounded border-l-4 border-green-500">
                            <p className="font-medium">Memory Complexity Analysis:</p>
                            <p><strong>Fast Doubling:</strong> O(log n) - Due to recursion depth</p>
                            <p><strong>Iterative:</strong> O(1) - Only stores two previous values</p>
                            <p><strong>Memoization:</strong> O(n) - Stores results in a cache</p>
                            <p><strong>Recursive:</strong> O(n) - Call stack grows with input size</p>
                            <p><strong>Dynamic Programming:</strong> O(n) - Stores array of n values</p>
                            <p><strong>Matrix Power:</strong> O(1) - Constant space complexity</p>
                            <p><strong>Binet Formula:</strong> O(1) - Uses mathematical formula with constant space</p>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="comparison">
                        <div className="bg-white p-4 rounded-lg shadow-inner overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">n</th>
                                        {Object.keys(colorMap).map(method => (
                                            <th 
                                                key={method} 
                                                scope="col" 
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                                style={{ color: colorMap[method] }}
                                            >
                                                {method}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.keys(fibResults).map(n => (
                                        <tr key={n} className={parseInt(n) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{n}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{fibResults[n]?.fastDoubling}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{fibResults[n]?.iterative}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{fibResults[n]?.memoization}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{fibResults[n]?.recursive}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{fibResults[n]?.dp}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{fibResults[n]?.matrix}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">{fibResults[n]?.binet}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-sm text-gray-600 bg-purple-50 p-3 rounded border-l-4 border-purple-500">
                            <p className="font-medium">Implementation Characteristics:</p>
                            <p><strong>Fast Doubling:</strong> Efficient for large numbers, leverages mathematical properties</p>
                            <p><strong>Iterative:</strong> Simple and efficient for moderate-sized sequences</p>
                            <p><strong>Memoization:</strong> Top-down approach with caching, good for sporadic calculations</p>
                            <p><strong>Recursive:</strong> Simplest implementation but extremely inefficient for n &gt; 40</p>
                            <p><strong>Dynamic Programming:</strong> Bottom-up approach, more space-efficient than memoization</p>
                            <p><strong>Matrix Power:</strong> Uses linear algebra properties, very efficient for large n</p>
                            <p><strong>Binet Formula:</strong> Direct formula calculation, may have floating-point precision issues for large n</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default FibonacciAnalysis;


