// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { t } from 'i18next'

const StyledCompanyName = styled(Link)(({ theme }) => ({
  fontWeight: 500,
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.text.secondary} !important`,
  '&:hover': {
    color: `${theme.palette.primary.main} !important`
  }
}))

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2, display: 'flex', color: 'text.secondary' }}>
        {`© ${new Date().getFullYear()}, ${t('Made with')} `}
        <Box component='span' sx={{ mx: 1, color: 'error.main' }}>
          ❤️
        </Box>
        {`${t('by')}`}
        <Typography sx={{ ml: 1 }} target='_blank' href='https://www.linkedin.com/in/jo%C3%ABl-aholou-1171a5174/' component={StyledCompanyName}>
          Joel Dev
        </Typography>
      </Typography>
      {(hidden || true) ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <Typography target='_blank' component={LinkStyled} href='https://themeforest.net/licenses/standard'>
            License
          </Typography>
          <Typography target='_blank' component={LinkStyled} href='https://1.envato.market/pixinvent_portfolio'>
            More Themes
          </Typography>
          <Typography
            target='_blank'
            component={LinkStyled}
            href='https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation'
          >
            Documentation
          </Typography>
          <Typography target='_blank' component={LinkStyled} href='https://pixinvent.ticksy.com'>
            Support
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
