import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

interface LabelProps {
  className?: string;
  color?:
  | 'primary'
  | 'black'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'bigsuccess'
  | 'insu';
  // Added 'bigsuccess' color option
  children?: ReactNode; // Defined children prop correctly
}

const LabelWrapper = styled('span')(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
      padding: ${theme.spacing(0.5, 1)};
      font-size: ${theme.typography.pxToRem(13)};
      border-radius: ${theme.general.borderRadius};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      max-height: ${theme.spacing(3)};
      width: 120px; /* Fixed width */
      height: 36px; /* Fixed height */
      font-weight:bold;

      &.MuiLabel {
        &-primary {
          background-color: ${theme.colors.primary.lighter};
          color: ${theme.palette.primary.main};
        }

        &-black {
          background-color: ${theme.colors.alpha.black[100]};
          color: ${theme.colors.alpha.white[100]};
        }
        
        &-secondary {
          background-color: ${theme.colors.secondary.lighter};
          color: ${theme.palette.secondary.main};
        }
        
        &-success { // Combine 'success' and 'bigsuccess'
          background-color: ${theme.colors.success.lighter};
          color: ${theme.palette.success.main};
         
        }
        
        &-warning {
          background-color: ${theme.colors.warning.lighter};
          color: ${theme.palette.warning.main};
        }
                
        &-error{ // Combine 'error' and 'bigerror'
          background-color: ${theme.colors.error.lighter};
          color: ${theme.palette.error.main};
         
        }
        
        &-info {
          background-color: ${theme.colors.info.lighter};
          color: ${theme.palette.info.main};
        }
        &-insu {
          background-color:#f2f2f2;
          color:#4d4d4d;
        }
      }
`
);


const StatusLabel: FC<LabelProps> = ({
  className,
  color = 'secondary',
  children, // Ensure 'children' is properly handled
  ...rest
}) => {
  return (
    <LabelWrapper className={`MuiLabel-${color}`} {...rest}>
      {children}
    </LabelWrapper>
  );
};

StatusLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'primary',
    'black',
    'secondary',
    'error',
    'warning',
    'success',
    'info',
    'bigsuccess',
    'insu'
    // Include 'bigsuccess' in PropTypes validation
  ])
};

export default StatusLabel;
