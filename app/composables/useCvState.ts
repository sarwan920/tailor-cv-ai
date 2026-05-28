import { useState } from '#imports';

export const useMasterCv = () => 
  useState('masterCv', () => ({
    id: '',
    title: 'Master Resume',
    content: ''
  }));

export const useJobForm = () => 
  useState('jobForm', () => ({
    jobTitle: '',
    company: '',
    jobDescription: '',
    customDirectives: ''
  }));

export const useTailoredResult = () => 
  useState('tailoredResult', () => null);

export const useTailoredContent = () => 
  useState('tailoredContent', () => '');

export const useTailoredAnalysis = () => 
  useState('tailoredAnalysis', () => ({
    matchedSkills: [],
    keywordsHighlighted: [],
    adjustmentsMade: []
  }));

export const useIsTailoring = () => 
  useState('isTailoring', () => false);

export const useTailoringStep = () => 
  useState('tailoringStep', () => 1);
