import { Nav, NavLink, PlainButton } from '../styles/Styled'

const Navigation = ({ user, handleLogout }) => {
  return (
    <Nav>
      <NavLink to="/">blogs</NavLink>
      {!user && (
        <NavLink to="/login">login</NavLink>
      )}
      {user && (
        <>
          <NavLink to="/create">new blog</NavLink>
          <span style={{ color: 'white' }}>{user.name} logged in</span>
          <PlainButton onClick={handleLogout}>logout</PlainButton>
        </>
      )}
    </Nav>
  )
}
export default Navigation