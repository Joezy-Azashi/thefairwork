 import {getUserType} from './auth'

export function recruiterRole () {
    const roles = getUserType()?.accountTypeId
    return (roles === 1)
}

export function localRecruiterRole () {
    const roles = getUserType()?.accountTypeId
    return (roles === 4)
}

export function freelancerRole () {
    const roles = getUserType()?.accountTypeId
    return (roles === 2)
}

export function adminRole () {
    const roles = getUserType()?.accountTypeId
    return (roles === 3)
}

export function freelancerAccountType () {
    const roles = 2
    return roles
}

export function recruiterAccountType () {
    const roles = 1
    return roles
}

export function clientAccountType () {
    const roles = 4
    return roles
}