var geoCoordMap = {
    '从江县': [108.902660, 25.756610],
    '镇远县': [108.424760, 27.052400],
    '天柱县': [109.202040, 26.911050],
    '锦屏县': [109.199300, 26.679980],
    '剑河县': [108.439180, 26.729670],
    '台江县': [108.319700, 26.669550],
    '黎平县': [109.130970, 26.233990],
    '榕江县': [108.519520, 25.933960],
    '雷山县': [108.072850, 26.380950],
    '麻江县': [107.589110, 26.493310],
    '丹寨县': [107.786870, 26.200420],
    '凯里市': [107.976380, 26.568570],
    '黄平县': [107.911490, 26.908600],
    '施秉县': [108.120570, 27.035580],
    '岑巩县': [108.808590, 27.176470],
    '三穗县': [108.670580, 26.955740],
};

var aData = [
    [{ name: '凯里市' }, { name: '麻江县', value: 95 }],
    [{ name: '凯里市' }, { name: '雷山县', value: 90 }],
    [{ name: '凯里市' }, { name: '丹寨县', value: 80 }],
    [{ name: '凯里市' }, { name: '三穗县', value: 70 }],
    [{ name: '凯里市' }, { name: '台江县', value: 60 }]
];

var bData = [
    [{ name: '雷山县' }, { name: '凯里市', value: 95 }],
    [{ name: '雷山县' }, { name: '榕江县', value: 90 }],
    [{ name: '雷山县' }, { name: '麻江县', value: 80 }],
    [{ name: '雷山县' }, { name: '锦屏县', value: 70 }],
    [{ name: '雷山县' }, { name: '镇远县', value: 60 }]
];

var cData = [
    [{ name: '天柱县' }, { name: '黄平县', value: 95 }],
    [{ name: '天柱县' }, { name: '镇远县', value: 90 }],
    [{ name: '天柱县' }, { name: '从江县', value: 80 }],
    [{ name: '天柱县' }, { name: '施秉县', value: 70 }],
    [{ name: '天柱县' }, { name: '剑河县', value: 60 }]
];

var planePath = 'path://M787.2 256H704V192c0-36.266667-27.733333-64-64-64H64C27.733333 128 0 155.733333 0 192v554.666667c0 36.266667 27.733333 64 64 64h64c0-70.4 57.6-128 128-128s128 57.6 128 128h256c0-70.4 57.6-128 128-128s128 57.6 128 128h64c36.266667 0 64-27.733333 64-64V452.266667c0-19.2-8.533333-38.4-25.6-51.2l-172.8-132.266667c-10.666667-8.533333-25.6-12.8-38.4-12.8zM981.333333 554.666667H704V298.666667h64c14.933333 0 27.733333 4.266667 38.4 12.8l149.333333 115.2c14.933333 12.8 25.6 29.866667 25.6 51.2V554.666667z';

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord]
            });
        }
    }
    return res;
};

var color = ['#a6c84c', '#ffa022', '#46bee9'];

var area = ['凯里市', '雷山县', '天柱县'];

export default {
    getArea() {
        return area;
    },
    generateSeries() {
        let series = []
        let src = [['凯里市', aData], ['雷山县', bData], ['天柱县', cData]]
        src.forEach(function (item, i) {
            series.push(
                {
                    name: item[0],
                    type: 'lines',
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 2,
                        trailLength: 0.7,
                        color: '#fff',
                        symbolSize: 3
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 0,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                },
                {
                    name: item[0],
                    type: 'lines',
                    zlevel: 2,
                    symbol: ['circle', 'arrow'],
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 2,
                        trailLength: 0,
                        //symbol: planePath,
                        symbolSize: 6
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                },
                {
                    name: item[0],
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] / 16;
                    },
                    itemStyle: {
                        normal: {
                            color: color[i]
                        }
                    },
                    data: item[1].map(function (dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                        };
                    })
                });
        });
        return series;
    }
}