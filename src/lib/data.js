// ─── Mock data ────────────────────────────────────────────────────────────────
// All shapes match the Supabase schema exactly (same field names, same types).
//
// To connect Supabase: replace each `return mock…` with a real query.
// Nothing outside this file needs to change.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category')

  if (error) {
    console.error('Error fetching skills:', error)
    return []
  }
  return data
}


export async function getJourneyLog() {
  const { data, error } = await supabase
    .from('journey_log')
    .select('*')
    .order('display_order')

  if (error) {
    console.error('Error fetching journey log:', error)
    return []
  }
  return data
}


export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_skills (
        skills ( id, name )
      )
    `)
    .order('display_order')

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data
}


export async function getProjectSkills() {
  const { data, error } = await supabase
    .from('project_skills')
    .select('*')

  if (error) {
    console.error('Error fetching project skills:', error)
    return []
  }
  return data
}



// Mock data for local development and testing

const mockProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Your Name',
  identity_line: "BTech CSE '27 · building toward full-stack web development",
  status: 'currently learning React',
  open_to: ['frontend internships', 'open source collaboration', 'project partnerships'],
  currently_note:
    'Building personal projects to sharpen my React skills and exploring what good software actually feels like to write.',
  github_url: 'https://github.com/yourusername',
  linkedin_url: 'https://linkedin.com/in/yourusername',
  email: 'you@example.com',
  updated_at: '2025-07-01T00:00:00Z',
}


export async function getProfile() {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  return data
}













