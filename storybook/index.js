/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import Markdown from 'react-markdown';
import { checkA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withViewport } from '@storybook/addon-viewport';
import { withInfo } from '@storybook/addon-info';
import ChangeRemoveSource from 'rc-source-loader!../examples/change-remove';
import ChangeSource from 'rc-source-loader!../examples/change';
import GetContainerSource from 'rc-source-loader!../examples/getContainer';
import LevelSource from 'rc-source-loader!../examples/level';
import MultipleSource from 'rc-source-loader!../examples/multiple';
import OpenRenderDomSource from 'rc-source-loader!../examples/openRenderDom';
import PlacementSource from 'rc-source-loader!../examples/placement';
import SimpleSource from 'rc-source-loader!../examples/simple';
import ChangeRemove from '../examples/change-remove';
import Change from '../examples/change';
import GetContainer from '../examples/getContainer';
import Level from '../examples/level';
import Multiple from '../examples/multiple';
import OpenRenderDom from '../examples/openRenderDom';
import Placement from '../examples/placement';
import Simple from '../examples/simple';
import READMECode from '../README.md';

storiesOf('rc-drawer', module)
  .addDecorator(checkA11y)
  .addDecorator(withInfo)
  .addDecorator((storyFn, context) => withConsole()(storyFn)(context))
  .addDecorator(withViewport())
  .add(
    'readMe',
    () => (
      <div
        className="markdown-body entry-content"
        style={{
          padding: 24,
        }}
      >
        <Markdown escapeHtml={false} source={READMECode} />
      </div>
    ),
    {
      source: {
        code: READMECode,
      },
    },
  )
  .add('change-remove', () => <ChangeRemove />, {
    source: {
      code: ChangeRemoveSource,
    },
  })
  .add('change', () => <Change />, {
    source: {
      code: ChangeSource,
    },
  })
  .add('getContainer', () => <GetContainer />, {
    source: {
      code: GetContainerSource,
    },
  })
  .add('level', () => <Level />, {
    source: {
      code: LevelSource,
    },
  })
  .add('multiple', () => <Multiple />, {
    source: {
      code: MultipleSource,
    },
  })
  .add('openRenderDom', () => <OpenRenderDom />, {
    source: {
      code: OpenRenderDomSource,
    },
  })
  .add('placement', () => <Placement />, {
    source: {
      code: PlacementSource,
    },
  })
  .add('simple', () => <Simple />, {
    source: {
      code: SimpleSource,
    },
  });
