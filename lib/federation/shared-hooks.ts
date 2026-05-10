// Shared hooks exposed via module federation
// These can be used by all micro frontend modules
// Note: Components using these hooks should be marked with 'use client'

export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
export { useTheme } from 'next-themes';
export { useCallback, useEffect, useState, useRef, useContext, useReducer } from 'react';
