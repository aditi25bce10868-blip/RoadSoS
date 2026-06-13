import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SimulatedEvent {
  type: string; magnitude: number; gMagnitude: number;
  speedBefore: number; speedAfter: number; inactivity: boolean;
  description: string; expectedScore: number;
}

export const SIMULATION_SCENARIOS: SimulatedEvent[] = [
  { type:'full_crash',        magnitude:4.5, gMagnitude:4.2, speedBefore:80,  speedAfter:0,  inactivity:true,  description:'🚗 Full Crash — High speed collision',      expectedScore:130 },
  { type:'highway_crash',     magnitude:3.8, gMagnitude:3.5, speedBefore:120, speedAfter:5,  inactivity:true,  description:'🛣️ Highway Crash — Very high speed',          expectedScore:130 },
  { type:'side_impact',       magnitude:3.2, gMagnitude:3.8, speedBefore:40,  speedAfter:0,  inactivity:true,  description:'↔️ Side Impact — T-bone collision',           expectedScore:130 },
  { type:'rollover',          magnitude:3.0, gMagnitude:5.5, speedBefore:60,  speedAfter:10, inactivity:true,  description:'🔄 Vehicle Rollover',                         expectedScore:130 },
  { type:'pedestrian_fall',   magnitude:3.5, gMagnitude:2.0, speedBefore:5,   speedAfter:0,  inactivity:true,  description:'🚶 Pedestrian Fall — Hit by vehicle',         expectedScore:120 },
  { type:'motorcycle_crash',  magnitude:4.0, gMagnitude:4.8, speedBefore:70,  speedAfter:0,  inactivity:true,  description:'🏍️ Motorcycle Crash',                        expectedScore:130 },
  { type:'low_speed_crash',   magnitude:2.6, gMagnitude:1.5, speedBefore:25,  speedAfter:0,  inactivity:true,  description:'🐢 Low Speed Crash — Just above threshold',   expectedScore:80  },
  { type:'impact_no_inact',   magnitude:3.5, gMagnitude:3.2, speedBefore:60,  speedAfter:20, inactivity:false, description:'⚠️ Impact + Movement After — Minor crash',    expectedScore:70  },
  { type:'decel_only',        magnitude:1.5, gMagnitude:1.0, speedBefore:80,  speedAfter:0,  inactivity:true,  description:'🛑 Sudden Stop Only — Emergency brake',       expectedScore:70  },
  { type:'phone_drop',        magnitude:3.0, gMagnitude:2.0, speedBefore:0,   speedAfter:0,  inactivity:false, description:'📱 Phone Drop — Should NOT trigger',          expectedScore:40  },
  { type:'pothole',           magnitude:2.6, gMagnitude:1.0, speedBefore:40,  speedAfter:38, inactivity:false, description:'🕳️ Pothole Hit — Should NOT trigger',        expectedScore:40  },
  { type:'hard_brake',        magnitude:1.2, gMagnitude:0.5, speedBefore:60,  speedAfter:5,  inactivity:false, description:'🛑 Hard Braking — Should NOT trigger',        expectedScore:30  },
  { type:'bumpy_road',        magnitude:1.8, gMagnitude:1.5, speedBefore:30,  speedAfter:25, inactivity:false, description:'🏔️ Bumpy Road — Should NOT trigger',          expectedScore:0   },
];

interface Props { onSimulate: (event: SimulatedEvent) => void; currentScore: number; }

export default function SimulatorPanel({ onSimulate, currentScore }: Props) {
  const [expanded, setExpanded] = useState(false);

  const triggers    = SIMULATION_SCENARIOS.filter((s) => s.expectedScore >= 80);
  const borderline  = SIMULATION_SCENARIOS.filter((s) => s.expectedScore >= 60 && s.expectedScore < 80);
  const falseAlarms = SIMULATION_SCENARIOS.filter((s) => s.expectedScore < 60);

  const renderScenario = (s: SimulatedEvent) => (
    <TouchableOpacity
      key={s.type}
      style={[
        styles.scenarioBtn,
        s.expectedScore >= 80 ? styles.triggerBtn :
        s.expectedScore >= 60 ? styles.borderBtn :
        styles.safeBtn,
      ]}
      onPress={() => onSimulate(s)}
      activeOpacity={0.8}
    >
      <View style={styles.scenarioLeft}>
        <Text style={styles.scenarioDesc}>{s.description}</Text>
        <Text style={styles.scenarioMeta}>
          💥{s.magnitude}g  🌀{s.gMagnitude}  🏎️{s.speedBefore}→{s.speedAfter}km/h
          {s.inactivity ? '  😶inactive' : '  🚶moving'}
        </Text>
      </View>
      <View style={[
        styles.scoreBox,
        s.expectedScore >= 80 ? styles.scoreBoxRed :
        s.expectedScore >= 60 ? styles.scoreBoxOrange :
        styles.scoreBoxGreen,
      ]}>
        <Text style={styles.scoreNum}>{s.expectedScore}</Text>
        <Text style={styles.scoreLabel}>pts</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={() => setExpanded((e) => !e)} activeOpacity={0.8}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="flask-outline" size={16} color="#CC0000" />
          </View>
          <Text style={styles.headerText}>Accident Simulation</Text>
          <View style={styles.testBadge}>
            <Text style={styles.testBadgeText}>TEST MODE</Text>
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#888" />
      </TouchableOpacity>

      {/* Score bar */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreBarRow}>
          <Text style={styles.scoreBarText}>Current Score</Text>
          <Text style={styles.scoreBarValue}>{currentScore}/80</Text>
        </View>
        <View style={styles.scoreTrack}>
          <View style={[styles.scoreFill, {
            width: `${Math.min((currentScore / 80) * 100, 100)}%`,
            backgroundColor: currentScore >= 80 ? '#CC0000' : currentScore >= 50 ? '#F59E0B' : '#10B981',
          }]} />
        </View>
      </View>

      {/* Scenarios */}
      {expanded && (
        <ScrollView style={styles.scenarioList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
          <Text style={styles.groupLabel}>🔴 Should Trigger SOS (score ≥ 80)</Text>
          {triggers.map(renderScenario)}
          <Text style={styles.groupLabel}>🟡 Borderline (score 60–79)</Text>
          {borderline.map(renderScenario)}
          <Text style={styles.groupLabel}>🟢 False Alarms — Should NOT trigger</Text>
          {falseAlarms.map(renderScenario)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(204,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  testBadge: {
    backgroundColor: 'rgba(204,0,0,0.08)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  testBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#CC0000',
    letterSpacing: 0.5,
  },
  scoreBar: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  scoreBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  scoreBarText: {
    fontSize: 12,
    color: '#888888',
  },
  scoreBarValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
  },
  scoreTrack: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 2,
  },
  scenarioList: {
    maxHeight: 400,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  scenarioBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
  },
  triggerBtn: {
    backgroundColor: 'rgba(204,0,0,0.04)',
    borderColor: 'rgba(204,0,0,0.2)',
  },
  borderBtn: {
    backgroundColor: 'rgba(245,158,11,0.04)',
    borderColor: 'rgba(245,158,11,0.2)',
  },
  safeBtn: {
    backgroundColor: 'rgba(16,185,129,0.04)',
    borderColor: 'rgba(16,185,129,0.2)',
  },
  scenarioLeft: {
    flex: 1,
    marginRight: 10,
  },
  scenarioDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 3,
  },
  scenarioMeta: {
    fontSize: 11,
    color: '#888888',
  },
  scoreBox: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: 48,
  },
  scoreBoxRed:    { backgroundColor: 'rgba(204,0,0,0.08)'    },
  scoreBoxOrange: { backgroundColor: 'rgba(245,158,11,0.08)' },
  scoreBoxGreen:  { backgroundColor: 'rgba(16,185,129,0.08)' },
  scoreNum: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#888888',
  },
});
