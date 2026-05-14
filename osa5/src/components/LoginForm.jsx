import {
  Form,
  InputGroup,
  Label,
  Input,
  PlainButton
} from '../styles/Styled'

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="username">username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </InputGroup>

        <PlainButton type="submit">login</PlainButton>
      </Form>
    </div>
  )
}
export default LoginForm