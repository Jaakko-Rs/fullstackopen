import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
`
export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #1f2937;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`
export const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`
export const PlainButton = styled.button`
  background: #2563eb;
  color: white;
  border: 0;
  border-radius: 6px;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
  margin-left: 0.5rem;
  &:hover {
    background: #1d4ed8;
  }
`
export const SecondaryButton = styled.button`
  background: #e5e7eb;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
  margin-left: 0.5rem;
  &:hover {
    background: #dbe1e7;
  }
`
export const Form = styled.form`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
`
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
`
export const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.25rem;
`
export const Input = styled.input`
  padding: 0.55rem 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
`
export const Card = styled.div`
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: white;
`
export const BlogTitleLink = styled(Link)`
  color: #1d4ed8;
  text-decoration: none;
  font-weight: 700;
  &:hover {
    text-decoration: underline;
  }
`
export const MutedText = styled.div`
  color: #4b5563;
`
export const NotificationBox = styled.div`
  margin: 0.75rem 0 1rem 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.$type === 'error' ? '#ef4444' : '#22c55e'};
  background: ${props => props.$type === 'error' ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$type === 'error' ? '#991b1b' : '#166534'};
`