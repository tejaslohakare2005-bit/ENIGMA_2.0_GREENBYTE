import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, Droplets, Thermometer, TreePine, TrendingDown, Zap } from 'lucide-react-native';
import { Colors, getScoreColor } from '@/constants/colors';
import { useSimulator } from '@/context/SimulatorContext';
import { MUMBAI_ZONES, getZoneAdjustedMetrics } from '@/constants/mumbaiData';
import HealthScoreGauge from '@/components/HealthScoreGauge';
import MetricCard from '@/components/MetricCard';

export default function DashboardScreen() {
  const { scores, scenario } = useSimulator();
  const router = useRouter();

  const avgMetrics = React.useMemo(() => {
    const adjusted = MUMBAI_ZONES.map((z) => getZoneAdjustedMetrics(z, scenario));
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    return {
      ndvi: avg(adjusted.map((m) => m.ndvi)),
      lst: avg(adjusted.map((m) => m.lst)),
      floodRisk: avg(adjusted.map((m) => m.floodRisk)),
      greenCover: avg(adjusted.map((m) => m.greenCover)),
    };
  }, [scenario]);

  const highRiskZones = MUMBAI_ZONES.filter((z) => {
    const m = getZoneAdjustedMetrics(z, scenario);
    return m.floodRisk > 0.6;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statusBanner}>
        <Activity size={14} color={Colors.accent.teal} />
        <Text style={styles.statusText}>Live Telemetry · Mumbai Metropolitan Region</Text>
        <View style={styles.liveDot} />
      </View>

      <View style={styles.gaugeSection}>
        <HealthScoreGauge score={scores.overall} label="Overall SDG 11" size={140} strokeWidth={10} />
        <View style={styles.subGauges}>
          <HealthScoreGauge score={scores.resilience} label="Resilience" size={80} strokeWidth={6} />
          <HealthScoreGauge score={scores.sustainability} label="Sustain." size={80} strokeWidth={6} />
          <HealthScoreGauge score={scores.access} label="Access" size={80} strokeWidth={6} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Key Metrics</Text>
      <View style={styles.metricsGrid}>
        <MetricCard
          title="NDVI Index"
          value={avgMetrics.ndvi.toFixed(2)}
          subtitle="Vegetation density"
          color={Colors.accent.teal}
          icon={<TreePine size={14} color={Colors.accent.teal} />}
        />
        <MetricCard
          title="Surface Temp"
          value={avgMetrics.lst.toFixed(1)}
          unit="°C"
          subtitle="Land surface temp"
          color={Colors.accent.coral}
          icon={<Thermometer size={14} color={Colors.accent.coral} />}
        />
      </View>
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Flood Risk"
          value={(avgMetrics.floodRisk * 100).toFixed(0)}
          unit="%"
          subtitle="Avg. zone risk"
          color={Colors.accent.blue}
          icon={<Droplets size={14} color={Colors.accent.blue} />}
        />
        <MetricCard
          title="Green Cover"
          value={avgMetrics.greenCover.toFixed(0)}
          unit="%"
          subtitle="Avg. zone cover"
          color={Colors.accent.teal}
          icon={<TreePine size={14} color={Colors.accent.teal} />}
        />
      </View>

      {highRiskZones.length > 0 && (
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Zap size={16} color={Colors.accent.amber} />
            <Text style={styles.alertTitle}>Risk Alerts</Text>
          </View>
          {highRiskZones.map((z) => {
            const m = getZoneAdjustedMetrics(z, scenario);
            return (
              <View key={z.id} style={styles.alertRow}>
                <View style={[styles.alertDot, { backgroundColor: getScoreColor(Math.round((1 - m.floodRisk) * 100)) }]} />
                <Text style={styles.alertZone}>{z.name}</Text>
                <Text style={[styles.alertRisk, { color: Colors.accent.coral }]}>
                  {(m.floodRisk * 100).toFixed(0)}% flood risk
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => router.push('/(tabs)/simulator')}
        activeOpacity={0.8}
      >
        <TrendingDown size={18} color={Colors.bg.primary} />
        <Text style={styles.ctaText}>Run What-If Scenario</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    padding: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bg.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  statusText: {
    color: Colors.text.secondary,
    fontSize: 12,
    fontWeight: '500' as const,
    flex: 1,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.teal,
  },
  gaugeSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  subGauges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  sectionTitle: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  alertCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.accent.amber + '30',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  alertTitle: {
    color: Colors.accent.amber,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  alertDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  alertZone: {
    color: Colors.text.primary,
    fontSize: 13,
    fontWeight: '500' as const,
    flex: 1,
  },
  alertRisk: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent.teal,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 20,
  },
  ctaText: {
    color: Colors.bg.primary,
    fontSize: 15,
    fontWeight: '700' as const,
  },
});
