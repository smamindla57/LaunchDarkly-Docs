jest.mock('gatsby', () => {
  const actual = jest.requireActual('gatsby')
  return {
    ...actual,
    navigate: jest.fn(),
  }
})
jest.mock('../../utils/siteAwareUtils', () => ({ __esModule: true, addRemoveSiteParam: jest.fn() }))
jest.mock('./useSite', () => ({ __esModule: true, default: jest.fn() }))

import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { navigate } from 'gatsby'

import { addRemoveSiteParam } from '../../utils/siteAwareUtils'

import SiteSelector from './siteSelector'
import useSite from './useSite'

const mockUseSite = useSite as jest.Mock
const mockSetSite = jest.fn()
const mockNavigate = navigate as jest.Mock
const mockGetUrlSiteAware = addRemoveSiteParam as jest.Mock

describe('site selector', () => {
  beforeEach(() => {
    mockUseSite.mockImplementation(() => ['launchDarkly', mockSetSite])
    mockGetUrlSiteAware.mockImplementation(() => 'mockUrl')
    render(<SiteSelector />)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('renders correctly with launchDarkly as default', () => {
    const siteSelector = screen.getByRole('combobox')
    expect(siteSelector).toHaveValue('launchDarkly')
  })

  test('renders launchDarkly and federal options', () => {
    const siteOptions = screen.getAllByRole('option')
    expect(siteOptions.length).toEqual(2)
    expect(siteOptions[0]).toHaveTextContent('LaunchDarkly docs')
    expect(siteOptions[1]).toHaveTextContent('Federal docs')
  })

  test('url update on site change', () => {
    const siteSelector = screen.getByRole('combobox')
    fireEvent.change(siteSelector, { target: { value: 'federal' } })
    expect(mockSetSite).toHaveBeenCalledWith('federal')
    expect(mockGetUrlSiteAware).toHaveBeenCalledWith('', 'federal', true)
    expect(mockNavigate).toHaveBeenCalledWith('mockUrl', { replace: true })
  })
})
