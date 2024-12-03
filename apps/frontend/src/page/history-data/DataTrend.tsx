import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { camelCase } from 'lodash-es'
import { FC, useEffect, useRef, useState } from 'react'

import {
  SensorReportData,
  SensorReportDataField
} from '../../interface/sensor.ts'

interface Props {
  sensorReportData: SensorReportData[]
  sensorReportDataField: SensorReportDataField[]
  loading?: boolean
}

export const DataTrend: FC<Props> = (props) => {
  const { sensorReportData, sensorReportDataField, loading = false } = props

  const [chart, setChart] = useState<echarts.ECharts>()
  const containerRef = useRef<HTMLDivElement>(null)
  // const chartRef = useRef<echarts.ECharts>()

  useEffect(() => {
    if (!chart) {
      return
    }

    if (loading) {
      chart.showLoading()
    } else {
      chart.hideLoading()
    }
  }, [chart, loading])

  useEffect(() => {
    if (!chart || !sensorReportData.length || !sensorReportDataField.length) {
      return
    }

    const xAxis = {
      type: 'time',
      data: sensorReportData.map(({ reportTime }) =>
        dayjs(reportTime).valueOf()
      )
    }

    const series = sensorReportDataField
      .filter(({ importLevel }) => importLevel === 2)
      .map(({ key, label }) => ({
        name: label,
        type: 'line', // 折线图
        // type: 'scatter', // 散点图
        sampling: 'lttb',
        showSymbol: false,
        smooth: true,
        // labelLayout: {
        //   moveOverlap: 'shiftY'
        // },
        // 折线图的高亮状态
        // emphasis: {
        // 在高亮图形时，是否淡出其它数据的图形已达到聚焦的效果。支持如下配置：
        // 'none' 不淡出其它图形，默认使用该配置
        // 'self' 只聚焦（不淡出）当前高亮的数据的图形
        // 'series' 聚焦当前高亮的数据所在的系列的所有图形
        // focus: 'self'
        // },
        endLabel: {
          show: true,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          formatter: function (params) {
            return params.seriesName
          }
        },
        // datasetId: camelCase(key),
        data: sensorReportData.map((data) => [
          data.reportTime,
          data[camelCase(key)]
        ])
      }))

    const option = {
      // title: {
      //   text: '数据趋势'
      // },
      tooltip: {
        // tooltip.trigger 设置为 'axis' 或者 tooltip.axisPointer.type 设置为 'cross'，则自动显示 axisPointer
        trigger: 'axis'
      },
      toolbox: {
        top: 24,
        // orient: 'vertical',
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          // restore: {},// 用这个会导致数据显示有问题，不确定什么原因
          saveAsImage: {}
        }
      },
      // 图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示。
      legend: {
        type: 'scroll',
        top: 0,
        left: 32,
        right: 300,
        data: series.map(({ name }) => name)
      },
      // dataset: sensorReportData,
      // 横轴
      xAxis,
      // 纵轴
      yAxis: {
        type: 'value'
      },
      // dataZoom 组件 用于区域缩放，从而能自由关注细节的数据信息，或者概览数据整体，或者去除离群点的影响。
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10
        },
        {
          start: 0,
          end: 10
        }
      ],
      series
    }

    chart.setOption(option)
  }, [chart, sensorReportData, sensorReportDataField])

  useEffect(() => {
    console.log('containerRef', containerRef.current)
    if (containerRef.current) {
      const chart = echarts.init(containerRef.current, null, {
        locale: 'ZH'
      })

      setChart(chart)

      const resize = () => {
        chart.resize()
      }

      window.addEventListener('resize', resize)

      return () => {
        window.removeEventListener('resize', resize)
      }
    }
  }, [containerRef])

  return (
    <div
      id="history-data-trend"
      ref={containerRef}
      style={{
        width: '100%',
        height: 'calc(100vh - 274px)',
        minHeight: '500px'
      }}
    ></div>
  )
}
