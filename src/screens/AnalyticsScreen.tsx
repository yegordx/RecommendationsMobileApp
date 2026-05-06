import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BarChart, PieChart, LineChart } from 'react-native-gifted-charts';
import { getMyAnalytics, AnalyticsResponse } from '../api/analytics';
import { Colors } from '../constants/colors';
import { useLanguage } from '../store/LanguageContext';

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - 32;


const TYPE_COLORS: Record<string, string> = {
  View: '#4A90E2',
  Like: '#50C878',
  Dislike: '#E25454',
  Save: '#E2A54A',
  Click: '#A54AE2',
};

const PIE_COLORS = ['#4A90E2', '#50C878', '#E2A54A', '#E25454', '#A54AE2', '#54C8E8'];

export function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const barData = data
    ? Object.entries(data.interactionsByType)
        .filter(([key]) => key !== 'Click')
        .map(([key, value]) => ({
          value,
          label: t.typeLabels[key as keyof typeof t.typeLabels] ?? key,
          frontColor: TYPE_COLORS[key] ?? Colors.accent,
          labelTextStyle: { color: Colors.secondaryText, fontSize: 10 },
        }))
    : [];

  const pieData = data?.topTopics.map((t, i) => ({
    value: t.count,
    text: t.name.length > 10 ? t.name.slice(0, 10) + '…' : t.name,
    color: PIE_COLORS[i % PIE_COLORS.length],
  })) ?? [];

  const lineViews = data?.dailyActivity.map((d) => ({ value: d.views })) ?? [];
  const lineLikes = data?.dailyActivity.map((d) => ({ value: d.likes })) ?? [];
  const lineSaves = data?.dailyActivity.map((d) => ({ value: d.saves })) ?? [];
  const lineLabels = data?.dailyActivity.map((d) => d.date) ?? [];

  const totalInteractions = data
    ? Object.values(data.interactionsByType).reduce((s, v) => s + v, 0)
    : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t.analytics}</Text>
        <View style={{ width: 70 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 60 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNum}>{totalInteractions}</Text>
              <Text style={styles.summaryLabel}>{t.totalInteractions}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNum}>{data?.topTopics.length ?? 0}</Text>
              <Text style={styles.summaryLabel}>{t.topicsCount}</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>{t.interactionsByType}</Text>
          <View style={styles.card}>
            {barData.length > 0 ? (
              <BarChart
                data={barData}
                width={CHART_W - 48}
                height={160}
                barWidth={36}
                barBorderRadius={6}
                noOfSections={4}
                yAxisTextStyle={{ color: Colors.secondaryText, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: Colors.secondaryText, fontSize: 10 }}
                yAxisColor={Colors.cardBorder}
                xAxisColor={Colors.cardBorder}
                rulesColor={Colors.cardBorder}
                hideRules={false}
                spacing={16}
                initialSpacing={8}
              />
            ) : (
              <Text style={styles.empty}>{t.noData}</Text>
            )}
          </View>

          <Text style={styles.sectionLabel}>{t.topTopics}</Text>
          <View style={styles.card}>
            {pieData.length > 0 ? (
              <View style={styles.pieRow}>
                <PieChart
                  data={pieData}
                  donut
                  radius={80}
                  innerRadius={50}
                  centerLabelComponent={() => (
                    <Text style={styles.pieCenter}>{pieData.length}{'\n'}{t.topicsUnit}</Text>
                  )}
                />
                <View style={styles.legend}>
                  {pieData.map((item, i) => (
                    <View key={i} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendText}>{item.text}</Text>
                      <Text style={styles.legendCount}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={styles.empty}>{t.noData}</Text>
            )}
          </View>

          <Text style={styles.sectionLabel}>{t.activityDays}</Text>
          <View style={styles.card}>
            {lineViews.length > 0 ? (
              <>
                <LineChart
                  data={lineViews}
                  data2={lineLikes}
                  data3={lineSaves}
                  width={CHART_W - 48}
                  height={160}
                  color1={TYPE_COLORS.View}
                  color2={TYPE_COLORS.Like}
                  color3={TYPE_COLORS.Save}
                  dataPointsColor1={TYPE_COLORS.View}
                  dataPointsColor2={TYPE_COLORS.Like}
                  dataPointsColor3={TYPE_COLORS.Save}
                  thickness={2}
                  noOfSections={4}
                  yAxisTextStyle={{ color: Colors.secondaryText, fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: Colors.secondaryText, fontSize: 9 }}
                  yAxisColor={Colors.cardBorder}
                  xAxisColor={Colors.cardBorder}
                  rulesColor={Colors.cardBorder}
                  xAxisLabelTexts={lineLabels}
                  curved
                />
                <View style={styles.lineLegend}>
                  {[
                    { color: TYPE_COLORS.View, label: t.lineLabels[0] },
                    { color: TYPE_COLORS.Like, label: t.lineLabels[1] },
                    { color: TYPE_COLORS.Save, label: t.lineLabels[2] },
                  ].map((l) => (
                    <View key={l.label} style={styles.lineLegendItem}>
                      <View style={[styles.lineDash, { backgroundColor: l.color }]} />
                      <Text style={styles.legendText}>{l.label}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.empty}>{t.noData}</Text>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  backText: { color: Colors.accent, fontSize: 15 },
  title: { color: Colors.white, fontSize: 17, fontWeight: '700' },
  scroll: { paddingHorizontal: 16, paddingTop: 4 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  summaryNum: { color: Colors.white, fontSize: 24, fontWeight: '700' },
  summaryLabel: { color: Colors.secondaryText, fontSize: 11, marginTop: 4, textAlign: 'center' },
  sectionLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  pieRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  pieCenter: { color: Colors.white, fontSize: 12, textAlign: 'center', fontWeight: '600' },
  legend: { flex: 1, gap: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: Colors.white, fontSize: 11, flex: 1 },
  legendCount: { color: Colors.secondaryText, fontSize: 11 },
  lineLegend: { flexDirection: 'row', gap: 16, marginTop: 12, flexWrap: 'wrap' },
  lineLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lineDash: { width: 16, height: 2, borderRadius: 1 },
  empty: { color: Colors.secondaryText, fontSize: 14, paddingVertical: 20 },
});
