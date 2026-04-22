import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#32B36A',
  primaryDark: '#1F8A47',
  background: '#F7FBF5',
  card: '#E6F7EA',
  cardSelected: '#DAF6E1',
  text: '#0E2A1F',
  muted: '#6B887A',
  danger: '#D9534F'
};

export const styles = StyleSheet.create({
  // Page shell
  safe: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  container: {
    padding: 20,
    paddingBottom: 40
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6
  },
  subtitle: {
    color: COLORS.muted,
    marginBottom: 16,
    fontSize: 14
  },

  // Cards & layout
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#00000008',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },

  // Photo upload
  photoUpload: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoPlaceholderText: {
    color: COLORS.primary,
    fontWeight: '700'
  },

  // Form fields
  label: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 6
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    color: COLORS.text,
    fontSize: 14
  },
  select: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden'
  },
  inputError: {
    borderColor: COLORS.danger
  },
  errorText: {
    color: COLORS.danger,
    marginTop: 6,
    fontSize: 12
  },

  // Form row helpers
  formRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12
  },

  // Segmented control (sex)
  segment: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 8,
    overflow: 'hidden',
    gap: 8
  },
  segmentItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center'
  },

  // Section headings & small text
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.text,
    fontSize: 15
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mutedText: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 2
  },

  // List items
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalCard: {
    width: '100%',
    maxWidth: 640,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6
  },

  // Primary / Secondary buttons
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#E8F6EF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff'
  },

  // Sticky CTA bar
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center'
  },

  // Owner chips
  ownerChip: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginRight: 10,
    backgroundColor: '#fff',
    minWidth: 120
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Custom Dropdown styles
  customDropdown: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 44,
    width: '100%',
  },
  customDropdownText: {
    color: COLORS.text,
    fontSize: 14,
  },
  customDropdownPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  dateButton: {
  backgroundColor: '#FAFAFA',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#F0F0F0',
  paddingHorizontal: 12,
  paddingVertical: 12,
  justifyContent: 'center',
  minHeight: 44,
},
dateButtonText: {
  color: COLORS.text,
  fontSize: 14,
},
dateButtonPlaceholder: {
  color: '#999',
  fontSize: 14,
},
// Add to styles object
dateButton: {
  backgroundColor: '#FAFAFA',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#F0F0F0',
  paddingHorizontal: 12,
  paddingVertical: 12,
  justifyContent: 'center',
  minHeight: 44,
},
dateButtonText: {
  color: COLORS.text,
  fontSize: 14,
},
dateButtonPlaceholder: {
  color: '#999',
  fontSize: 14,
},

});